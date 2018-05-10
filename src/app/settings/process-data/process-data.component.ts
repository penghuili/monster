import { Component, OnInit } from '@angular/core';
import { DbService, NotificationService, ProjectService, TodoService } from '@app/core';
import { Event, EventType, MonsterEvents, MonsterStorage, Project, Subproject, Todo, TodoStatus } from '@app/model';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'mst-process-data',
  templateUrl: './process-data.component.html',
  styleUrls: ['./process-data.component.scss']
})
export class ProcessDataComponent implements OnInit {
  todosText: string;
  projectsText: string;
  subprojectsText: string;

  constructor(
    private dbService: DbService,
    private notificationService: NotificationService,
    private projectService: ProjectService,
    private todoService: TodoService) {
  }

  ngOnInit() {
    this.todosText = JSON.stringify(MonsterStorage.get('todos'));
    this.projectsText = JSON.stringify(MonsterStorage.get('projects'));
    this.subprojectsText = JSON.stringify(MonsterStorage.get('sub-projects'));
  }

  onCopyTodos(isSuccess: boolean) {
    const message = isSuccess ? 'success :>' : 'failded ;)';
    this.notificationService.sendMessage('Copy todos ' + message);
  }
  onCopyProjects(isSuccess: boolean) {
    const message = isSuccess ? 'success :>' : 'failded ;)';
    this.notificationService.sendMessage('CopyProjects ' + message);
  }
  onCopySubprojects(isSuccess: boolean) {
    const message = isSuccess ? 'success :>' : 'failded ;)';
    this.notificationService.sendMessage('Copy Subprojects ' + message);
  }

  onDeleteTodos() {
    MonsterStorage.remove('in-progress');
    MonsterStorage.remove('done-recently');
    MonsterStorage.remove('tags');
    MonsterStorage.remove('todos');
    this.notificationService.sendMessage('Delete todos success :>');
  }
  onDeleteProjects() {
    MonsterStorage.remove('projects');
    this.notificationService.sendMessage('DeleteProjects success :>');
  }
  onDeleteSubprojects() {
    MonsterStorage.remove('sub-projects');
    this.notificationService.sendMessage('Delete Subprojects success :>');
  }

  onProcessTodos() {
    this.todoService.process();
    this.notificationService.sendMessage('process todos success :>');
  }
  onProcessProjects() {
    this.projectService.processProjects();
    this.notificationService.sendMessage('process projects success :>');
  }
  onProcessSubprojects() {
    this.projectService.processSubprojects();
    this.notificationService.sendMessage('process subprojects success :>');
  }


  onMoveData() {
    // sort and add index
    let projects: Project[] = MonsterStorage.get('projects')
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((a, i) => {
        a.index = i + 1;
        return a;
      });
    let subprojects: Subproject[] = MonsterStorage.get('sub-projects')
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((a, i) => {
        a.index = i + 1;
        return a;
      });
    let todos: Todo[] = MonsterStorage.get('todos')
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((a, i) => {
        a.index = i + 1;
        if (a.status === TodoStatus.WontDo) {
          a.finishAt = a.updatedAt;
        }
        return a;
      });

    // keep relation
    subprojects = subprojects.map(a => {
      const p: any = projects.find(bb => bb.id === a.projectId);
      a.projectId = p.index;
      return a;
    });
    todos = todos.map(a => {
      const subp: any = subprojects.find(bb => bb.id === a.subprojectId);
      a.subprojectId = subp.index;
      if (a.nextId) {
        a.nextId = todos.find(aa => aa.id === a.nextId).id;
      }
      if (a.prevId) {
        a.prevId = todos.find(aa => aa.id === a.prevId).id;
      }
      return a;
    });

    // generate events
    let events: Event[] = [];
    todos.filter((a: any) => a.activities && a.activities.length > 0)
      .forEach((todo: any) => {
        todo.activities.forEach(activity => {
          events.push({
            createdAt: activity.startAt,
            refId: todo.index,
            type: EventType.Todo,
            action: MonsterEvents.StartTodo
          });
          events.push({
            createdAt: activity.endAt,
            refId: todo.index,
            type: EventType.Todo,
            action: MonsterEvents.StopTodo
          });
        });
      });
    todos.forEach((a: any) => {
      events.push({
        createdAt: a.createdAt,
        refId: a.index,
        type: EventType.Todo,
        action: MonsterEvents.CreateTodo
      });
    });
    projects.forEach((a: any) => {
      events.push({
        createdAt: a.createdAt,
        refId: a.index,
        type: EventType.Project,
        action: MonsterEvents.CreateProject
      });
    });
    subprojects.forEach((a: any) => {
      events.push({
        createdAt: a.createdAt,
        refId: a.index,
        type: EventType.Subproject,
        action: MonsterEvents.CreateSubproject
      });
    });
    events = events.sort((a, b) => a.createdAt - b.createdAt);

    // delete id and index
    projects = projects.map((a: any) => {
      delete a.id;
      delete a.index;
      return a;
    });
    subprojects = subprojects.map((a: any) => {
      delete a.id;
      delete a.index;
      return a;
    });
    todos = todos.map((a: any) => {
      delete a.id;
      delete a.index;
      delete a.activities;
      return a;
    });

    combineLatest(
      this.dbService.addTodos(todos),
      this.dbService.addProjects(projects),
      this.dbService.addSubprojects(subprojects),
      this.dbService.addEvents(events)
    ).subscribe(value => {
      if (value[0] && value[1] && value[2] && value[3]) {
        this.notificationService.sendMessage('move data success');
      } else {
        this.notificationService.sendMessage('move data failed');
      }
    });
  }
}
