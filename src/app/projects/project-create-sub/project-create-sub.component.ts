import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubprojectService } from '@app/core';
import { Project } from '@app/model';
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

  titleControl = new InputControl<string>({ required: true });
  resultControl = new InputControl<string>({ required: true });

  constructor(private subprojectService: SubprojectService) {
    super();
  }

  onOpen() {
    this.isShow = true;
  }
  onFinish() {
    if (this.titleControl.valid && this.resultControl.valid && this.project) {
      this.addSubscription(
        this.subprojectService.addSubproject({
          projectId: this.project.id,
          title: this.titleControl.getValue(),
          result: this.resultControl.getValue()
        }).subscribe(success => {
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
    this.resultControl.reset();
  }

}
