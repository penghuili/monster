import { Component, OnInit } from '@angular/core';
import { DbService, NotificationService, ProjectService, TodoService } from '@app/core';
import { Event, EventType, MonsterEvents, MonsterStorage, Project, Subproject, Todo, TodoStatus } from '@app/model';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { fromPromise } from 'rxjs/observable/fromPromise';

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

  onAddUsedTime() {
    const db = this.dbService.getDB();
    const transaction = db.transaction('rw', db.todos, db.events, () => {
      let events: Event[];
      return db.events
        .where('type')
        .equals(EventType.Todo)
        .toArray()
        .then(es => {
          events = es;
          return db.todos.toArray();
        })
        .then(todos => {
          return [events, todos];
        });
    });
    fromPromise(transaction).subscribe(([events, todos]) => {
      const startSopEvents = (<Event[]>events).filter(a => a.action === MonsterEvents.StartTodo || a.action === MonsterEvents.StopTodo);
      if (startSopEvents.length % 2 === 0) {
        const startEvents = startSopEvents.filter((a, i) => i % 2 === 0);
        const stopEvents = startSopEvents.filter((a, i) => i % 2 === 1);
        const todosWithUsedTime = (<Todo[]>todos).map(a => {
          a.usedTime = this.calcUsedTimeFor(a.id, startEvents, stopEvents);
          return a;
        });
        db.todos.bulkPut(todosWithUsedTime)
        .then(() => {
          this.notificationService.sendMessage('add used time success');
        })
        .catch(error => {
          alert(error);
        });
      } else {
        this.notificationService.sendMessage('events should be even');
      }
    });
  }

  private calcUsedTimeFor(todoId: number, startEvents: Event[], stopEvents: Event[]): number {
    const todoStarts = startEvents.filter(a => a.refId === todoId);
    const todoStops = stopEvents.filter(a => a.refId === todoId);
    if (todoStarts.length === todoStops.length) {
      const milisec = todoStarts.reduce((total, curr, i) => {
        return total + todoStops[i].createdAt - curr.createdAt;
      }, 0);
      return Math.round(milisec / (1000 * 60));
    } else {
      return 0;
    }
  }
}
