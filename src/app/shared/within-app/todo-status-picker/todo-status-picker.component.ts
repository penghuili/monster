import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoStatus } from '@app/model';

@Component({
  selector: 'mst-todo-status-picker',
  templateUrl: './todo-status-picker.component.html',
  styleUrls: ['./todo-status-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoStatusPickerComponent {
  @Input() set status(value: TodoStatus) {
    this.outerStatus = value;
    this.innerStatus = value;
  }
  @Output() select = new EventEmitter<TodoStatus>();
  isShow = false;
  TodoStatus = TodoStatus;
  innerStatus = TodoStatus.InProgress;
  private outerStatus = TodoStatus.InProgress;

  onOpen() {
    this.isShow = true;
  }
  onSelect(status: TodoStatus) {
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
