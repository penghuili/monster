import { INBOX } from '../static/config';
import { Item } from './item';
import { Project } from './project';
import { now } from './time';

export interface Todo extends Item {
  projectId: string;
  note?: string;
  happenDate: number;
  // In minutes
  expectedTime?: number;
  status: TodoStatus;
  position: string;
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
    projectId: data.projectId || INBOX.id,
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
