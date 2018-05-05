import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, TodoService } from '@app/core';
import { Project } from '@app/model';
import { InputControl } from '@app/shared';
import { INBOX, Unsub } from '@app/static';

@Component({
  selector: 'mst-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.scss']
})
export class TodoCreateComponent extends Unsub implements OnInit {
  titleControl = new InputControl('');
  noteControl = new InputControl('');
  happenDate: number;
  expectedTime: number;
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
    this.happenDate = date;
  }
  onDurationChange(duration: number) {
    this.expectedTime = duration;
  }
  onCreate() {
    const title = this.titleControl.getValue();
    const note = this.noteControl.getValue();
    const expectedTime = this.expectedTime;
    const project = this.currentProject;
    const happenDate = this.happenDate;
    if (title) {
      this.hasError = false;
      const todo = { title, note, projectId: project.id, expectedTime, happenDate };
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
