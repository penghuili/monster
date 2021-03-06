import { isToday } from 'date-fns';
import { last } from 'ramda';

import { Event, MonsterEvents } from './event';
import { SortableItem, sortByPosition } from './item';
import { ProjectWithTodos } from './project';
import { isAfterDay, isBeforeDay, isBeforeToday, isDayOrAfter, isWithin, isWithinDay, now } from './time';
import { MonsterStorage } from './utils';

export const OVERDUE = 'overdue';
export const TODAY = 'today';
export const TOMORROW = 'tomorrow';
export const THISWEEK = 'this week';

export interface Todo extends SortableItem {
  subprojectId: number;
  note?: string;
  happenDate: number;
  happenDateChangedTimes?: number;
  // in seconds
  expectedTime?: number;
  // in seconds
  usedTime?: number;
  status: TodoStatus;
  finishAt?: number;
  addedLater?: boolean;
  whyTooLate?: string;
}
export interface TodoThought {
  id?: number;
  todoId: number;
  createdAt: number;
  thought: string;
}
export enum TodoStatus {
  InProgress,
  Waiting,
  Someday,
  Done,
  WontDo
}

export function createTodo(data: any): Todo {
  const timestamp = now();
  return {
    title: data.title,
    subprojectId: data.subprojectId,
    note: data.note,
    happenDate: data.happenDate || timestamp,
    expectedTime: data.expectedTime || 0,
    usedTime: 0,
    status: data.status,
    position: timestamp.toString() + '3',
    createdAt: timestamp,
    updatedAt: timestamp,
    addedLater: data.addedLater
  };
}
export function mapTodoStatusEvent(status: TodoStatus): string {
  switch (status) {
    case TodoStatus.InProgress:
      return MonsterEvents.InProgressTodo;
    case TodoStatus.Waiting:
      return MonsterEvents.WaitingTodo;
    case TodoStatus.Someday:
      return MonsterEvents.SomedayTodo;
    case TodoStatus.Done:
      return MonsterEvents.DoneTodo;
    case TodoStatus.WontDo:
      return MonsterEvents.WontDoTodo;
    default:
      throw Error('invalid todo status');
  }
}
export function isOverDue(todo: Todo): boolean {
  return isBeforeToday(todo.happenDate) && !isFinished(todo);
}
export function isFinished(todo: Todo): boolean {
  return todo && (todo.status === TodoStatus.Done || todo.status === TodoStatus.WontDo);
}
export function isFinishTooLate(todo: Todo): boolean {
  return todo && isFinished(todo) && todo.expectedTime > 0 && todo.usedTime > 1.2 * todo.expectedTime;
}
export function isFinishTooEarly(todo: Todo): boolean {
  return todo && isFinished(todo) && todo.expectedTime > 10 * 60 && todo.usedTime < 0.8 * todo.expectedTime;
}
/**
 * @todo not pure
 */
export function isTodayStarted(): boolean {
  const start = MonsterStorage.get('start-today');
  return start && isWithinDay(start, now());
}
export function calcUsedTime(startSopEvents: Event[], endOfTimeRange: number, todoId: number): number {
  let startEvents: Event[];
  let stopEvents: Event[];

  const eventsOfTimeRange = startSopEvents.filter(a => a.createdAt < endOfTimeRange);
  if (eventsOfTimeRange[0] && eventsOfTimeRange[0].action === MonsterEvents.StopTodo) {
    eventsOfTimeRange.unshift();
  }
  startEvents = eventsOfTimeRange.filter(a => a.action === MonsterEvents.StartTodo);
  stopEvents = eventsOfTimeRange.filter(a => a.action === MonsterEvents.StopTodo);

  const lastEventOfTimeRange = last(eventsOfTimeRange);
  if (lastEventOfTimeRange && lastEventOfTimeRange.action === MonsterEvents.StartTodo) {
    const secondDayEvents = startSopEvents.filter(a => a.createdAt > endOfTimeRange);
    const firstEventOfSecondDay = secondDayEvents[0];
    if (firstEventOfSecondDay &&
      firstEventOfSecondDay.action === MonsterEvents.StopTodo &&
      firstEventOfSecondDay.refId === lastEventOfTimeRange.refId) {
        stopEvents.push(firstEventOfSecondDay);
    } else {
      startEvents.pop();
    }
  }

  if (todoId !== undefined) {
    startEvents = startEvents.filter(a => a.refId === todoId);
    stopEvents = stopEvents.filter(a => a.refId === todoId);
  }
  if (startEvents.length === stopEvents.length) {
    const milisec = startEvents.reduce((total, curr, i) => {
      return total + stopEvents[i].createdAt - curr.createdAt;
    }, 0);
    return Math.round(milisec / 1000);
  } else {
    return 0;
  }
}
export function calcExpectedTime(todos: Todo[]): number {
  return todos.reduce((sum, curr) => sum + curr.expectedTime, 0);
}
export function sortTodo(a: Todo, b: Todo): number {
  if (isFinished(b)) {
    return -1;
  } else if (a.status === TodoStatus.InProgress && isOverDue(a)) {
    return -1;
  } else if (a.status === TodoStatus.Waiting && isOverDue(a) && (b.status === TodoStatus.Waiting || b.status === TodoStatus.Someday)) {
    return -1;
  } else if (a.status === TodoStatus.InProgress && !isOverDue(a) &&
    !(isOverDue(b) && b.status === TodoStatus.InProgress)) {
    return -1;
  } else if (a.status === TodoStatus.Waiting && !isOverDue(a) &&
    ((b.status === TodoStatus.Waiting && !isOverDue(b)) || b.status === TodoStatus.Someday)) {
    return -1;
  } else if (a.status === TodoStatus.Someday && b.status === TodoStatus.Someday) {
    return -1;
  } else {
    return 1;
  }
}
export function sortTodos(todos: Todo[], options?: any): Todo[] {
  if (!todos || todos.length === 0) {
    return [];
  }
  const func = options && options.compare ? items => items.sort((a, b) => options.compare(a, b)) :
    sortByPosition;
  const overdue = <Todo[]>func(todos.filter(a => a.status === TodoStatus.InProgress && isOverDue(a)));
  const inProgress = <Todo[]>func(todos.filter(a => a.status === TodoStatus.InProgress && !isOverDue(a)));
  const waiting = <Todo[]>func(todos.filter(a => a.status === TodoStatus.Waiting));
  const someday = <Todo[]>func(todos.filter(a => a.status === TodoStatus.Someday));
  const finished = <Todo[]>func(todos.filter(a => isFinished(a)));
  return [
    ...overdue,
    ...inProgress,
    ...waiting,
    ...someday,
    ...finished
  ];
}
export function calcStartEndDate(todos: Todo[]): number[] {
  const sortedByHappenDate = todos ? todos.sort((a, b) => a.happenDate - b.happenDate) : [];
  const len = sortedByHappenDate.length;
  const startDate = sortedByHappenDate[0] ? sortedByHappenDate[0].happenDate : now();
  const endDate = sortedByHappenDate[len - 1] ? sortedByHappenDate[len - 1].happenDate : now();
  return [startDate, endDate];
}
export function isValidTodoWithin(todo: Todo, start: number, end: number): boolean {
  return isWithin(todo.happenDate, start, end) ||
  (isBeforeDay(todo.happenDate, start) && (!todo.finishAt || isDayOrAfter(todo.finishAt, start))) ||
  (isAfterDay(todo.happenDate, end) && isWithin(todo.finishAt, start, end));
}
export function isRedoingOverdue(): boolean {
  const start = MonsterStorage.get('redo-overdue-at');
  return start && now() - start < 5 * 60 * 1000;
}
export function redoneOverdueForToday(): boolean {
  const start = MonsterStorage.get('redo-overdue-at');
  return start && isToday(start);
}
export function getActiveTab() {
  return MonsterStorage.get('active-tab') || TODAY;
}
export function hasTodos(projectsWithTodos: ProjectWithTodos[]): boolean {
  return projectsWithTodos && projectsWithTodos.length > 0 && !projectsWithTodos.every(a => !a || !a.todos || a.todos.length === 0);
}
