import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FollowingService } from '@app/core';
import { Following, now } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';

@Component({
  selector: 'mst-following-item-create',
  templateUrl: './following-item-create.component.html',
  styleUrls: ['./following-item-create.component.scss']
})
export class FollowingItemCreateComponent extends Unsub implements OnInit {
  @Input() following: Following;
  @Output() created = new EventEmitter<boolean>();
  noteControl = new InputControl<string>({ required: true });
  points = 1;

  constructor(private followingService: FollowingService) {
    super();
  }

  ngOnInit() {
  }

  onValueChange(value) {
    this.points = Math.round(value);
  }
  onAdd() {
    if (this.noteControl.valid) {
      this.addSubscription(
        this.followingService.addFollowingItem({
          followingId: this.following.id,
          note: this.noteControl.getValue(),
          points: this.following.hasPoints ? this.points : undefined,
          createdAt: now()
        }).subscribe(success => {
          if (success) {
            this.created.emit(true);
          }
        })
      );
    }
  }
}
