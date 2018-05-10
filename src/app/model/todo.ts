import { format } from 'date-fns';

import { SortableItem } from './item';
import { now } from './time';

export interface Todo extends SortableItem {
  subprojectId: number;
  note?: string;
  happenDate: number;
  // In minutes
  expectedTime?: number;
  status: TodoStatus;
  finishAt?: number;
  isHappenDateFixed?: boolean;
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
    status: data.status,
    position: timestamp.toString() + '3',
    createdAt: timestamp,
    updatedAt: timestamp
  };
}
export function isOverdue(todo: Todo): boolean {
  return todo && format(todo.happenDate, 'YYYYMMDD') < format(now(), 'YYYYMMDD');
}
