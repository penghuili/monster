import { Event } from '@app/model';

import { SortableItem } from './item';
import { isBeforeToday, isWithinDay, now, startOfToday } from './time';
import { MonsterStorage } from './utils';

export interface Todo extends SortableItem {
  subprojectId: number;
  note?: string;
  happenDate: number;
  // In minutes
  expectedTime?: number;
  usedTime?: number;
  status: TodoStatus;
  finishAt?: number;
  projectTitle?: string;
}
export interface TodoActivity {
  startAt: number;
  endAt: number;
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
    updatedAt: timestamp
  };
}
export function isOverDue(todo: Todo): boolean {
  return isBeforeToday(todo.happenDate) && !isFinished(todo);
}
export function isFinished(todo: Todo): boolean {
  return todo && (todo.status === TodoStatus.Done || todo.status === TodoStatus.WontDo);
}
export function isFinishTooLate(todo: Todo): boolean {
  return todo && isFinished(todo) && todo.expectedTime > 0 && todo.usedTime > 1.05 * todo.expectedTime;
}
export function isFinishTooEarly(todo: Todo): boolean {
  return todo && isFinished(todo) && todo.expectedTime > 0 && todo.usedTime < 0.95 * todo.expectedTime;
}
/**
 * @todo not pure
 */
export function isTodayStarted(): boolean {
  const start = MonsterStorage.get('start-today');
  return start && isWithinDay(start, now());
}
export function isTodayEnded(): boolean {
  /**
   * @todo trigger notification at 11 pm if today is not ended, or end it automatically
   */
  const end = MonsterStorage.get('end-today');
  return end && end < now() && end > startOfToday();
}
export function calcUsedTime(startSopEvents: Event[], todoId: number): number {
  let startEvents = startSopEvents.filter((a, i) => i % 2 === 0);
  let stopEvents = startSopEvents.filter((a, i) => i % 2 === 1);
  if (todoId !== undefined) {
    startEvents = startEvents.filter(a => a.refId === todoId);
    stopEvents = stopEvents.filter(a => a.refId === todoId);
  }
  if (startEvents.length === stopEvents.length) {
    const milisec = startEvents.reduce((total, curr, i) => {
      return total + stopEvents[i].createdAt - curr.createdAt;
    }, 0);
    return Math.round(milisec / (1000 * 60));
  } else {
    return 0;
  }
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
export function calcStartEndDate(todos: Todo[]): number[] {
  const sortedByHappenDate = todos ? todos.sort((a, b) => a.happenDate - b.happenDate) : [];
  const len = sortedByHappenDate.length;
  const startDate = sortedByHappenDate[0] ? sortedByHappenDate[0].happenDate : now();
  const endDate = sortedByHappenDate[len - 1] ? sortedByHappenDate[len - 1].happenDate : now();
  return [startDate, endDate];
}
