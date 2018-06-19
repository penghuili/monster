import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FollowingStatus } from '@app/model';

@Component({
  selector: 'mst-following-status-picker',
  templateUrl: './following-status-picker.component.html',
  styleUrls: ['./following-status-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FollowingStatusPickerComponent {
  @Input() set status(value: FollowingStatus) {
    this.outerStatus = value;
    this.innerStatus = value;
  }
  @Output() select = new EventEmitter<FollowingStatus>();
  isShow = false;
  FollowingStatus = FollowingStatus;
  innerStatus = FollowingStatus.InProgress;
  showError: boolean;

  private outerStatus = FollowingStatus.InProgress;

  onOpen() {
    this.isShow = true;
  }
  onSelect(status: FollowingStatus) {
    this.innerStatus = status;
  }

  onConfirm() {
    this.select.emit(this.innerStatus);
    this.isShow = false;
  }
  onCancel() {
    this.innerStatus = this.outerStatus;
    this.isShow = false;
  }

}
