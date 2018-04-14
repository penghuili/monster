import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, TodoService } from '@app/core';
import { Project } from '@app/model';
import { InputControl } from '@app/shared';
import { INBOX, Unsub } from '@app/static';

@Component({
  selector: 'monster-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class TodoCreateComponent extends Unsub implements OnInit {
  titleControl = new InputControl('');
  noteControl = new InputControl('');
  hoursControl = new InputControl('');
  happenOn: number;
  hasError = false;

  currentProject: Project = INBOX;
  showProjects = false;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService) {
      super();
    }

  ngOnInit() {
    this.addSubscription(
      this.projectService.getCurrent().subscribe(p => {
        this.currentProject = p;
      })
    );
  }

  onShowProjects() {
    this.showProjects = true;
  }
  onSelectProject(project: Project) {
    this.currentProject = project;
    this.showProjects = false;
  }
  onFinishPickDate(date: number) {
    this.happenOn = date;
  }
  onCreate() {
    const title = this.titleControl.getValue();
    const note = this.noteControl.getValue();
    const hours = +this.hoursControl.getValue();
    const project = this.currentProject;
    const happenOn = this.happenOn;
    if (title) {
      this.hasError = false;
      const todo = { title, note, projectId: project.id, hours, happenOn };
      this.todoService.create(todo);
      this.router.navigate([ '../' ], { relativeTo: this.route });
    } else {
      this.hasError = true;
    }
  }
  onCancel() {
    this.router.navigate([ '../' ], { relativeTo: this.route });
  }
}
