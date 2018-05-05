import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, TodoService } from '@app/core';
import { now, Project, Todo } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { merge } from 'ramda';
import { debounceTime, first } from 'rxjs/operators';

@Component({
  selector: 'mst-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.scss']
})
export class TodoDetailComponent extends Unsub implements OnInit {
  todo: Todo;
  titleControl = new InputControl('');
  noteControl = new InputControl('');
  hasError = false;
  currentProject: Project;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService) {
      super();
    }

  ngOnInit() {
    this.addSubscription(
      this.todoService.getById(this.route.snapshot.paramMap.get('id')).pipe(
        first()
      ).subscribe(todo => {
        this.todo = todo;
        this.currentProject = this.projectService.getById(this.todo.projectId);
        this.titleControl.setValue(this.todo.title);
        this.noteControl.setValue(this.todo.note);
      })
    );

    this.addSubscription(
      this.titleControl.value$.pipe(
        debounceTime(300)
      ).subscribe(title => {
        this.update({ title });
      })
    );

    this.addSubscription(
      this.noteControl.value$.pipe(
        debounceTime(300)
      ).subscribe(note => {
        this.update({ note });
      })
    );
  }

  onDurationChange(duration: number) {
    this.update({ expectedTime: duration });
  }
  onSelectProject(project: Project) {
    this.update({ projectId: project.id });
  }
  onFinishPickDate(date: number) {
    this.update({ happenDate: date });
  }
  onBack() {
    this.router.navigate([ '../' ], { relativeTo: this.route });
  }
  onFinish() {
    this.todoService.finish(this.todo.id);
    this.router.navigate([ '../' ], { relativeTo: this.route });
  }

  private update(data: any) {
    const title = this.titleControl.getValue();
    if (title) {
      this.hasError = false;
      const todo = merge(this.todo, {
        ...data,
        updatedAt: now()
      });
      this.todoService.update(todo);
    } else {
      this.hasError = true;
    }
  }
}
