import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, SubprojectService, TodoService } from '@app/core';
import {
  calcStartEndDate,
  EventType,
  mapProjectStatusEvent,
  now,
  ProjectStatus,
  sortTodos,
  Subproject,
  Todo,
} from '@app/model';
import { InputControl } from '@app/shared';
import { ROUTES, Unsub } from '@app/static';
import { merge } from 'ramda';
import { debounceTime, first, startWith, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'mst-project-detail-sub',
  templateUrl: './project-detail-sub.component.html',
  styleUrls: ['./project-detail-sub.component.scss']
})
export class ProjectDetailSubComponent extends Unsub implements OnInit {
  subproject: Subproject;
  todos: Todo[];
  titleControl = new InputControl({ required: true });
  resultControl = new InputControl({ required: true });
  startDate: number;
  endDate: number;

  private createdTodo = new Subject<boolean>();

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private subprojectService: SubprojectService,
    private todoService: TodoService) {
    super();
  }

  ngOnInit() {
    const subid = +this.route.snapshot.paramMap.get('subid');
    this.addSubscription(
      this.createdTodo.asObservable().pipe(
        startWith(true),
        switchMap(() => this.subprojectService.getSubprojectById(subid).pipe(first()))
      )
      .subscribe(subproject => {
        this.subproject = subproject;
        this.titleControl.setValue(this.subproject.title);
        this.resultControl.setValue(this.subproject.result);
      })
    );

    this.addSubscription(
      this.createdTodo.asObservable().pipe(
        startWith(true),
        switchMap(() => this.todoService.getTodosBySubprojectId(subid))
      )
      .subscribe(todos => {
        this.todos = sortTodos(todos);
        const startEnd = calcStartEndDate(todos);
        this.startDate = startEnd[0];
        this.endDate = startEnd[1];
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
  onCreatedTodo() {
    this.createdTodo.next(true);
  }

  private update(data: any) {
    if (this.titleControl.valid && this.resultControl.valid) {
      this.subproject = merge(this.subproject, {
        ...data, updatedAt: now()
      });
      this.subprojectService.updateSubproject(this.subproject);
    }
  }

}
