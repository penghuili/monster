import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, ProjectService, SubprojectService, TodoService } from '@app/core';
import {
  calcStartEndDate,
  ChartDataItem,
  createChartData,
  EventType,
  mapProjectStatusEvent,
  MonsterEvents,
  now,
  Project,
  ProjectStatus,
  ProjectTimelineItem,
  Subproject,
  Tab,
  TimeRangeType,
  Todo,
  TodoStatus,
} from '@app/model';
import { DatepickerResult, InputControl } from '@app/shared';
import { ROUTES, Unsub } from '@app/static';
import { addDays, differenceInCalendarDays, format } from 'date-fns';
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
  titleControl = new InputControl({ required: true });
  resultControl = new InputControl({ required: true });

  status: ProjectStatus;
  startDate: number;
  endDate: number;
  endDateStartDate: number;
  TimeRangeType = TimeRangeType;

  chartData: ChartDataItem[];
  timelineData: ProjectTimelineItem[];
  GROWTH = 'growth';
  TIMELINE = 'timeline';
  tabs: Tab[] = [
    { key: this.GROWTH, value: this.GROWTH },
    { key: this.TIMELINE, value: this.TIMELINE }
  ];
  activeTab = this.GROWTH;

  private createdSub = new Subject<boolean>();

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private subprojectService: SubprojectService,
    private todoService: TodoService) {
    super();
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.addSubscription(
      this.projectService.getProjectById(id).pipe(first()).subscribe(project => {
        this.project = project;
        if (project) {
          this.titleControl.setValue(project.title);
          this.resultControl.setValue(project.result);
          this.status = this.project.status;
          this.startDate = project.startDate;
          this.endDateStartDate = addDays(this.startDate, 1).getTime();
          this.endDate = project.endDate;
        }
      })
    );

    this.addSubscription(
      this.createdSub.asObservable().pipe(
        startWith(true),
        switchMap(() => this.subprojectService.getSubprojectsWithTodosByProjectId(id))
      ).subscribe(value => {
        this.subprojects = value.subprojects;
        this.createChart(value.todos);
        this.createTimeline(value.subprojects, value.todos);
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
    this.router.navigateByUrl(`${ROUTES.PLANS}/${ROUTES.SUB_PROJECTS}/${subid}`);
  }
  onCreateSub() {
    this.createdSub.next(true);
  }
  onChangeTab(key: string) {
    this.activeTab = key;
  }

  private createChart(todos: Todo[]) {
    if (todos) {
      const items = todos
        .sort((a, b) => a.happenDate - b.happenDate)
        .map(a => ({name: format(a.happenDate, 'YYYY-MM-DD'), value: 1}));

      const doneTodos = todos
        .filter(a => a.status === TodoStatus.Done || a.status === TodoStatus.WontDo)
        .sort((a, b) => a.finishAt - b.finishAt);
      const lastDoneTodo = doneTodos[doneTodos.length - 1];
      let lastDoneToNow = [];
      if (lastDoneTodo) {
        const diff = differenceInCalendarDays(now(), lastDoneTodo.finishAt);
        if (diff > 0) {
          lastDoneToNow = Array(diff).fill(1).map((curr, index) => {
            const date = addDays(lastDoneTodo.finishAt, index + 1);
            return {name: format(date, 'YYYY-MM-DD'), value: 0};
          });
        }
      }
      const doneItems = doneTodos
        .map(a => ({name: format(a.finishAt, 'YYYY-MM-DD'), value: 1}))
        .concat(lastDoneToNow);

      const plan = createChartData(items);
      const done = createChartData(doneItems);

      this.chartData = [
        { name: 'plan', series: plan },
        { name: 'done', series: done }
      ];
    }
  }
  private createTimeline(subprojects: Subproject[], todos: Todo[]) {
    if (subprojects && todos) {
      this.timelineData = subprojects
      .map(s => {
        const ownTodos = todos.filter(a => a.subprojectId === s.id);
        if (!s || ownTodos.length === 0) {
          return null;
        } else {
          const startEnd = calcStartEndDate(ownTodos);
          return {
            name: s.title,
            start: startEnd[0],
            end: startEnd[1],
            finished: s.status === ProjectStatus.Done
          };
        }
      })
      .filter(a => !!a)
      .sort((a, b) => a.start - b.start);

      if (this.timelineData.length > 0) {
        const beggining = this.timelineData[0].start;
        this.timelineData = this.timelineData.map(a => {
          return {
            name: a.name,
            start: Math.round((a.start - beggining) / (1000 * 60 * 60)),
            end: Math.round((a.end - beggining) / (1000 * 60 * 60)),
            finished: a.finished
          };
        });
      } else {
        return [];
      }
    } else {
      this.timelineData = [];
    }
  }
  private emitEvent(data: any) {
    const event = {
      ...data,
      createdAt: now(),
      refId: this.project.id,
      type: EventType.Project
    };
    this.eventService.add(event).subscribe();
  }
  private update(data: any) {
    if (this.titleControl.valid && this.resultControl.valid) {
      this.project = merge(this.project, {
        ...data,
        updatedAt: now()
      });
      this.projectService.updateProject(this.project);
    }
  }
}
