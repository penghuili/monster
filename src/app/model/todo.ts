import { SortableItem } from './item';
import { isBeforeToday, now, startOfToday } from './time';
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
export interface TodoGroup {
  [key: string]: Todo[];
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
/**
 * @todo not pure
 */
export function isTodayStarted(): boolean {
  const start = MonsterStorage.get('start-today');
  return start && start < now() && start > startOfToday();
}
export function isTodayEnded(): boolean {
  /**
   * @todo trigger notification at 11 pm if today is not ended, or end it automatically
   */
  const end = MonsterStorage.get('end-today');
  return end && end < now() && end > startOfToday();
}
