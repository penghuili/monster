import { Component, EventEmitter, Output } from '@angular/core';
import { createSubproject, Subproject, Todo } from '@app/model';
import { InputControl } from '@app/shared';

@Component({
  selector: 'mst-project-create-sub',
  templateUrl: './project-create-sub.component.html',
  styleUrls: ['./project-create-sub.component.scss']
})
export class ProjectCreateSubComponent {
  @Output() create = new EventEmitter<Subproject>();
  isShow = false;

  titleControl = new InputControl('');
  resultControl = new InputControl('');
  hasTitleError = false;
  hasResultError = false;

  todos: Todo[] = [];

  onOpen() {
    this.isShow = true;
  }
  onFinish() {
    const title = this.titleControl.getValue();
    const result = this.resultControl.getValue();
    if (title && result) {
      this.hasResultError = false;
      this.hasTitleError = false;
      const subproject = createSubproject({ title, result, todos: this.todos });
      this.create.emit(subproject);
      this.isShow = false;
    } else {
      this.hasTitleError = !title;
      this.hasResultError = !result;
    }
  }
  onCancel() {
    this.isShow = false;
    this.hasResultError = false;
    this.hasTitleError = false;
  }

}
