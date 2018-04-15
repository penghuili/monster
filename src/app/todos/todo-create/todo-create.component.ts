import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, TodoService } from '@app/core';
import { Project } from '@app/model';
import { InputControl } from '@app/shared';
import { INBOX, Unsub } from '@app/static';

@Component({
  selector: 'mst-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class TodoCreateComponent extends Unsub implements OnInit {
  titleControl = new InputControl('');
  noteControl = new InputControl('');
  happenOn: number;
  days: number;
  hours: number;
  hasError = false;

  currentProject: Project = INBOX;

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

  onSelectProject(project: Project) {
    this.currentProject = project;
  }
  onFinishPickDate(date: number) {
    this.happenOn = date;
  }
  onDayChange(days: number) {
    this.days = days;
  }
  onHourChange(hours: number) {
    this.hours = hours;
  }
  onCreate() {
    const title = this.titleControl.getValue();
    const note = this.noteControl.getValue();
    const days = this.days;
    const hours = this.hours;
    const project = this.currentProject;
    const happenOn = this.happenOn;
    if (title) {
      this.hasError = false;
      const todo = { title, note, projectId: project.id, days, hours, happenOn };
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
