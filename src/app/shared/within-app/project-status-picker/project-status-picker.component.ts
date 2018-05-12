import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectStatus } from '@app/model';

@Component({
  selector: 'mst-project-status-picker',
  templateUrl: './project-status-picker.component.html',
  styleUrls: ['./project-status-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectStatusPickerComponent {
  @Input() set status(value: ProjectStatus) {
    this.outerStatus = value;
    this.innerStatus = value;
  }
  @Output() select = new EventEmitter<ProjectStatus>();
  isShow = false;
  ProjectStatus = ProjectStatus;
  innerStatus = ProjectStatus.InProgress;
  private outerStatus = ProjectStatus.InProgress;

  onOpen() {
    this.isShow = true;
  }
  onSelect(status: ProjectStatus) {
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
