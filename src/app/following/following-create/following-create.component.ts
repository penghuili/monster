import { Component, EventEmitter, Output } from '@angular/core';
import { FollowingService } from '@app/core';
import { createFollowing, FollowingStatus, now } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';

@Component({
  selector: 'mst-following-create',
  templateUrl: './following-create.component.html',
  styleUrls: ['./following-create.component.scss']
})
export class FollowingCreateComponent extends Unsub {
  @Output() created = new EventEmitter<boolean>();
  isShow = false;

  titleControl = new InputControl<string>({ required: true });
  defaultSwitch = false;
  timestamp: number;

  private hasPoints: boolean;
  private status: FollowingStatus;

  constructor(private followingService: FollowingService) {
    super();
  }

  onOpen() {
    this.isShow = true;
  }
  onSelectStatus(status: FollowingStatus) {
    this.status = status;
  }
  onHasPoints(hasPoints: boolean) {
    this.hasPoints = hasPoints;
  }
  onFinish() {
    if (this.titleControl.valid) {
      const following = createFollowing({
        title: this.titleControl.getValue(),
        status: this.status === undefined ? FollowingStatus.InProgress : this.status,
        hasPoints: !!this.hasPoints
      });
      this.addSubscription(
        this.followingService.add(following).subscribe(success => {
          if (success) {
            this.isShow = false;
            this.created.emit(true);
            this.reset();
          }
        })
      );
    }
  }
  onCancel() {
    this.isShow = false;
    this.reset();
  }

  private reset() {
    this.titleControl.reset();
    this.hasPoints = undefined;
    this.status = undefined;
    this.timestamp = now();
  }

}
