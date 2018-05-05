import { ALL, INBOX } from '../static/config';
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
  position: number;
  finishAt?: number;
  activities: TodoActivity[];
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
    expectedTime: data.expectedTime,
    status: TodoStatus.InProgress,
    position: timestamp,
    activities: [],
    createdAt: timestamp,
    updatedAt: timestamp
  };
}
export function filterTodos(todos: Todo[], project?: Project): Todo[] {
  if (!todos || !project || project.id === ALL.id) {
    return todos;
  } else {
    return todos.filter(a => a.projectId === project.id);
  }
}
