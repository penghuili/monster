import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectService } from '@app/core';
import { Project, Subproject, Todo } from '@app/model';
import { InputControl } from '@app/shared';

@Component({
  selector: 'mst-project-create-sub',
  templateUrl: './project-create-sub.component.html',
  styleUrls: ['./project-create-sub.component.scss']
})
export class ProjectCreateSubComponent {
  @Input() project: Project;
  isShow = false;

  titleControl = new InputControl('');
  resultControl = new InputControl('');
  hasTitleError = false;
  hasResultError = false;

  todos: Todo[] = [];

  constructor(private projectService: ProjectService) {}

  onOpen() {
    this.isShow = true;
  }
  onFinish() {
    const title = this.titleControl.getValue();
    const result = this.resultControl.getValue();
    if (title && result && this.project) {
      this.hasResultError = false;
      this.hasTitleError = false;
      const subproject = this.projectService.createSubproject({
        projectId: this.project.id,
        title, result,
        todos: this.todos
      });
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
