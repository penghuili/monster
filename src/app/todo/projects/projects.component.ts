import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Project } from '../../model/project';

@Component({
  selector: 'monster-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  @Input() projects: Project[];
  @Input() activeId: string;
  @Output() selected = new EventEmitter<Project>();
  @Output() create = new EventEmitter<Project>();

  control = new BehaviorSubject<string>('');
  isShow = false;
  isAdding = false;

  onCreate() {
    this.isAdding = true;
  }
  onFinish() {
    const data: Project = { title: this.control.getValue() };
    this.create.emit(data);
    this.isAdding = false;
  }

  show() {
    this.isShow = true;
  }
  hide() {
    this.isShow = false;
  }
  onSelect(project: Project) {
    if (project.id !== this.activeId) {
      this.selected.emit(project);
    }
  }

}
