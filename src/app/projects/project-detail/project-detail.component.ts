import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, ProjectService, TodoService } from '@app/core';
import {
  ChartDataItem,
  EventType,
  createChartData,
  mapProjectStatusEvent,
  MonsterEvents,
  now,
  Project,
  ProjectStatus,
  Subproject,
  TimeRangeType,
  TodoStatus,
} from '@app/model';
import { DatepickerResult, InputControl } from '@app/shared';
import { ROUTES, Unsub } from '@app/static';
import { addDays, format } from 'date-fns';
import { merge } from 'ramda';
import { debounceTime, first, startWith, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'mst-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent extends Unsub implements OnInit {
  project: Project;
  subprojects: Subproject[];
  titleControl = new InputControl('');
  resultControl = new InputControl('');

  hasTitleError = false;
  hasResultError = false;

  status: ProjectStatus;
  startDate: number;
  endDate: number;
  endDateStartDate: number;
  TimeRangeType = TimeRangeType;

  chartData: ChartDataItem[];

  private createdSub = new Subject<boolean>();

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private todoService: TodoService) {
    super();
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.addSubscription(
      this.projectService.getProjectById(id).pipe(first()).subscribe(project => {
        this.project = project;
        this.titleControl.setValue(project.title);
        this.resultControl.setValue(project.result);
        this.status = this.project.status;
        this.startDate = project.startDate;
        this.endDateStartDate = addDays(this.startDate, 1).getTime();
        this.endDate = project.endDate;
      })
    );

    this.addSubscription(
      this.createdSub.asObservable().pipe(
        startWith(true),
        switchMap(() => this.projectService.getSubprojects(id))
      ).subscribe(subprojects => {
        this.subprojects = subprojects;
      })
    );

    this.addSubscription(
      this.todoService.getTodosByProjectId(id).subscribe(todos => {
        const items = todos
          .sort((a, b) => a.happenDate - b.happenDate)
          .map(a => ({name: format(a.happenDate, 'YYYY-MM-DD'), value: 1}));
        const doneItems = todos
          .filter(a => a.status === TodoStatus.Done || a.status === TodoStatus.WontDo)
          .sort((a, b) => a.finishAt - b.finishAt)
          .map(a => ({name: format(a.finishAt, 'YYYY-MM-DD'), value: 1}));
        const plan = createChartData(items);
        const done = createChartData(doneItems);
        this.chartData = [
          { name: 'plan', series: plan },
          { name: 'done', series: done }
        ];
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
    this.emitEvent({
      action,
      oldValue: this.project.status,
      newValue: status
    });

    this.status = status;
    this.update({ status });
  }
  onPickStartDate(result: DatepickerResult) {
    this.emitEvent({
      action: MonsterEvents.ChangeProjectStartDate,
      oldValue: this.project.startDate,
      newValue: result.date
    });

    this.startDate = result.date;
    this.endDateStartDate = addDays(this.startDate, 1).getTime();
    if (this.startDate > this.endDate) {
      this.endDate = addDays(this.startDate, 1).getTime();
      this.update({ startDate: result.date, endDate: this.endDate });
    } else {
      this.update({ startDate: result.date });
    }
  }
  onPickEndDate(result: DatepickerResult) {
    this.emitEvent({
      action: MonsterEvents.ChangeProjectEndDate,
      oldValue: this.project.endDate,
      newValue: result.date
    });

    this.endDate = result.date;
    this.update({ endDate: result.date });
  }
  onGotoSub(subid: string) {
    this.router.navigate([ ROUTES.SUB_PROJECTS, subid ]);
  }
  onCreateSub() {
    this.createdSub.next(true);
  }

  private emitEvent(data: any) {
    const event = {
      ...data,
      createdAt: now(),
      refId: this.project.id,
      type: EventType.Project
    };
    this.eventService.add(event);
  }
  private update(data: any) {
    const title = this.titleControl.getValue();
    const result = this.resultControl.getValue();

    if (title && result) {
      this.hasResultError = false;
      this.hasTitleError = false;
      this.project = merge(this.project, {
        ...data,
        updatedAt: now()
      });
      this.projectService.updateProject(this.project);
    } else {
      this.hasTitleError = !title;
      this.hasResultError = !result;
    }
  }
}
