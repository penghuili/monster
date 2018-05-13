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
export function calcUsedTimeFor(todoId: number, startEvents: Event[], stopEvents: Event[]): number {
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
export function sortTodo(a: Todo, b: Todo): number {
  if (isFinished(b)) {
    return -1;
  } else if (a.status === TodoStatus.InProgress && isOverDue(a)) {
    return -1;
  } else if (a.status === TodoStatus.Waiting && isOverDue(a) && b.status === TodoStatus.Waiting) {
    return -1;
  } else if (a.status === TodoStatus.InProgress && !isOverDue(a) &&
    !(isOverDue(b) && b.status === TodoStatus.InProgress)) {
    return -1;
  } else if (a.status === TodoStatus.Waiting && !isOverDue(a) && b.status === TodoStatus.Waiting) {
    return -1;
  } else {
    return 1;
  }
}
