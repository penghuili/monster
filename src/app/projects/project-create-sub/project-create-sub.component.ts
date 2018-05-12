import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectService } from '@app/core';
import { Project, Todo } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';

@Component({
  selector: 'mst-project-create-sub',
  templateUrl: './project-create-sub.component.html',
  styleUrls: ['./project-create-sub.component.scss']
})
export class ProjectCreateSubComponent extends Unsub {
  @Input() project: Project;
  @Output() created = new EventEmitter<boolean>();
  isShow = false;

  titleControl = new InputControl('');
  resultControl = new InputControl('');
  hasTitleError = false;
  hasResultError = false;

  constructor(private projectService: ProjectService) {
    super();
  }

  onOpen() {
    this.isShow = true;
  }
  onFinish() {
    const title = this.titleControl.getValue();
    const result = this.resultControl.getValue();
    if (title && result && this.project) {
      this.hasResultError = false;
      this.hasTitleError = false;
      this.addSubscription(
        this.projectService.addSubproject({
          projectId: this.project.id,
          title, result
        }).subscribe(success => {
          if (success) {
            this.isShow = false;
            this.created.emit(true);
            this.reset();
          }
        })
      );
    } else {
      this.hasTitleError = !title;
      this.hasResultError = !result;
    }
  }
  onCancel() {
    this.isShow = false;
    this.reset();
  }

  private reset() {
    this.titleControl.setValue('');
    this.resultControl.setValue('');
    this.hasTitleError = false;
    this.hasResultError = false;
  }

}
