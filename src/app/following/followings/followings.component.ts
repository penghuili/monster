import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FollowingService } from '@app/core';
import { Following, FollowingStatus, sortByPosition } from '@app/model';
import { Unsub } from '@app/static';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'mst-followings',
  templateUrl: './followings.component.html',
  styleUrls: ['./followings.component.scss']
})
export class FollowingsComponent extends Unsub implements OnInit {
  activeFollowings: Following[];
  somedayFollowings: Following[];
  doneFollowings: Following[];
  dragIndex: number;

  private shouldLoad = new EventEmitter<boolean>();

  constructor(
    private followingService: FollowingService,
    private route: ActivatedRoute,
    private router: Router) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.shouldLoad.asObservable().pipe(
        startWith(true),
        switchMap(() => this.followingService.getFollowings())
      )
      .subscribe(followings => {
        followings = <Following[]>sortByPosition(followings || []);
        this.activeFollowings = followings.filter(a => a.status === FollowingStatus.InProgress);
        this.somedayFollowings = followings.filter(a => a.status === FollowingStatus.Someday);
        this.doneFollowings = followings.filter(a => a.status === FollowingStatus.Done);
      })
    );
  }

  onShowDetail(following: Following) {
    this.router.navigate([following.id], { relativeTo: this.route });
  }
  onDragStart(index: number) {
    console.log(index);
    // todo
  }
  onDrop(index: number) {
    console.log(index);
    // todo
  }
  onCreated() {
    this.shouldLoad.next(true);
  }
}
