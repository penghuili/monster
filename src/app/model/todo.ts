import { INBOX } from '../static/config';
import { SortableItem } from './item';
import { now } from './time';

export interface Todo extends SortableItem {
  subprojectId: string;
  note?: string;
  happenDate: number;
  // In minutes
  expectedTime?: number;
  status: TodoStatus;
  finishAt?: number;
  activities: TodoActivity[];
  nextId?: string;
  prevId?: string;
}
export interface TodoActivity {
  startAt: number;
  endAt: number;
}
export enum TodoStatus {
  InProgress,
  Done
}

export function createTodo(data: any): Todo {
  const timestamp = now();
  return {
    id: `t${timestamp}`,
    title: data.title,
    subprojectId: data.subprojectId || INBOX.id,
    note: data.note,
    happenDate: data.happenDate || timestamp,
    expectedTime: data.expectedTime || 0,
    status: TodoStatus.InProgress,
    position: timestamp.toString() + '3',
    activities: [],
    createdAt: timestamp,
    updatedAt: timestamp
  };
}
