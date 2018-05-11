import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, ProjectService, TodoService } from '@app/core';
import { EventType, mapProjectStatusEvent, now, ProjectStatus, Subproject, Todo } from '@app/model';
import { InputControl } from '@app/shared';
import { ROUTES, Unsub } from '@app/static';
import { merge } from 'ramda';
import { debounceTime, first } from 'rxjs/operators';

@Component({
  selector: 'mst-project-detail-sub',
  templateUrl: './project-detail-sub.component.html',
  styleUrls: ['./project-detail-sub.component.scss']
})
export class ProjectDetailSubComponent extends Unsub implements OnInit {
  subproject: Subproject;
  todos: Todo[];
  titleControl = new InputControl('');
  resultControl = new InputControl('');
  hasTitleError = false;
  hasResultError = false;
  startDate: number;
  endDate: number;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private todoService: TodoService) {
    super();
  }

  ngOnInit() {
    const subid = +this.route.snapshot.paramMap.get('subid');
    this.addSubscription(
      this.projectService.getSubprojectById(subid).pipe(
        first()
      ).subscribe(subproject => {
        this.subproject = subproject;
        this.titleControl.setValue(this.subproject.title);
        this.resultControl.setValue(this.subproject.result);
      })
    );

    this.addSubscription(
      this.todoService.getTodosBySubprojectId(subid).subscribe(todos => {
        this.todos = todos;
        const sorted = this.todos ? this.todos.sort((a, b) => a.happenDate - b.happenDate) : [];
        const len = sorted.length;
        this.startDate = sorted[0] ? sorted[0].happenDate : undefined;
        this.endDate = sorted[len - 1] ? sorted[len - 1].happenDate : undefined;
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
      this.resultControl.value$.pipe(
        debounceTime(300)
      ).subscribe(result => {
        this.update({ result });
      })
    );
  }

  onSelectStatus(status: ProjectStatus) {
    const action = mapProjectStatusEvent(status);
    const event = {
      createdAt: now(),
      refId: this.subproject.id,
      type: EventType.Subproject,
      action,
      oldValue: this.subproject.status,
      newValue: status
    };
    this.eventService.add(event);
    this.update({ status });
  }
  onGotoTodo(id: string) {
    this.router.navigateByUrl(`${ROUTES.TODOS}/${id}`);
  }

  private update(data: any) {
    const title = this.titleControl.getValue();
    const result = this.resultControl.getValue();

    if (title && result) {
      this.hasResultError = false;
      this.hasTitleError = false;
      this.subproject = merge(this.subproject, {
        ...data, updatedAt: now()
      });
      this.projectService.updateSubproject(this.subproject);
    } else {
      this.hasTitleError = !title;
      this.hasResultError = !result;
    }
  }

}
