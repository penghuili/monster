import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { merge } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Project } from '../../model/project';
import { Todo } from '../../model/todo';
import { INBOX } from '../../static/config';
import { ProjectsComponent } from '../projects/projects.component';

@Component({
  selector: 'monster-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class TodoCreateComponent implements OnChanges {
  @Input() currentTodo: Todo;
  @Input() currentProject: Project;
  @Output() newTodo = new EventEmitter<Todo>();
  @Output() close = new EventEmitter<boolean>();
  @ViewChild(ProjectsComponent) projectsC: ProjectsComponent;

  titleControl = new BehaviorSubject<string>('');
  noteControl = new BehaviorSubject<string>('');
  hoursControl = new BehaviorSubject<string>('');

  selectProject: Project;
  isShow = false;
  hasError = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentTodo'] || changes['currentProject']) {
      this.selectProject = this.currentTodo ? this.currentTodo.project : (this.currentProject || INBOX);
    }
  }

  show() {
    this.isShow = true;
  }
  hide() {
    this.isShow = false;
    this.close.emit(true);
    this.reset();
  }
  onStop(e: MouseEvent) {
    e.stopPropagation();
  }
  onShowProjects() {
    this.projectsC.show();
  }
  onChangeProject(project: Project) {
    this.selectProject = project;
  }
  onCreate() {
    const title = this.titleControl.getValue();
    const note = this.noteControl.getValue();
    const hours = +this.hoursControl.getValue();
    const project = this.selectProject;
    const now = new Date().getTime();
    if (title) {
      this.hasError = false;
      const todo = this.currentTodo ? merge(this.currentTodo, { title, note, project, hours, updatedAt: now }) :
        { title, note, project, hours, createdAt: now };
      this.newTodo.emit(todo);
      this.hide();
    } else {
      this.hasError = true;
    }
  }

  private reset() {
    this.currentTodo = undefined;
    this.currentProject = INBOX;
    this.selectProject = undefined;
    this.hasError = false;
    this.titleControl.next('');
    this.noteControl.next('');
    this.hoursControl.next('');
  }
}
