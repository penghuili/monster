import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FollowingService } from '@app/core';
import { ChartDataItem, Event, EventType, Following, FollowingItem, FollowingStatus, MonsterEvents } from '@app/model';
import { Unsub } from '@app/static';
import { format } from 'date-fns';
import { merge, reverse } from 'ramda';
import { startWith, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'mst-following-detail',
  templateUrl: './following-detail.component.html',
  styleUrls: ['./following-detail.component.scss']
})
export class FollowingDetailComponent extends Unsub implements OnInit {
  following: Following;
  showCreate = false;
  chartData: ChartDataItem[];
  activities: Event[];

  private followingItems: FollowingItem[];
  private loadItems = new Subject<boolean>();

  constructor(
    private followingService: FollowingService,
    private route: ActivatedRoute) {
      super();
    }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');

    this.addSubscription(
      this.followingService.getFollowingById(id).subscribe(following => {
        this.following = following;
      })
    );

    this.addSubscription(
      this.loadItems.asObservable().pipe(
        startWith(true),
        switchMap(() => this.followingService.getFollowingItemsByFollowingId(id))
      ).subscribe(items => {
        this.followingItems = items || [];

        this.activities = reverse(this.followingItems)
        .map(a => ({
          id: a.id,
          refId: a.id,
          action: MonsterEvents.CreateFollowingItem,
          createdAt: a.createdAt,
          type: EventType.FollowingItem,
          data: {following: this.following, followingItem: a}
        }));
        this.chartData = [
          {
            name: 'points',
            series: this.followingItems.map(item => ({
              name: format(item.createdAt, 'YY.MM.DD HH:mm'),
              value: item.points
            }))
          }
        ];
      })
    );
  }

  onSelectStatus(status: FollowingStatus) {
    if (this.following && this.following.status !== status) {
      this.addSubscription(
        this.followingService.update(merge(this.following, {status})).subscribe()
      );
    }
  }
  onToggleCreateItem() {
    this.showCreate = !this.showCreate;
  }
  onCreatedItem() {
    this.showCreate = false;
    this.loadItems.next(true);
  }
}
