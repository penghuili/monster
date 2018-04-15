import { ALL, INBOX } from '../static/config';
import { Item } from './item';
import { Project } from './project';
import { now } from './time';

export interface Todo extends Item {
  projectId?: string;
  note?: string;
  happenOn?: number;
  days?: number;
  hours?: number;
  status?: TodoStatus;
  finishAt?: number;
  startAt?: number;
  endAt?: number;
}

export enum TodoStatus {
  InProgress,
  Done,
  InTrash
}

export function createTodo(data: Todo): Todo {
  const timestamp = now();
  return {
    id: `t${timestamp}`,
    title: data.title,
    projectId: data.projectId || INBOX.id,
    note: data.note,
    happenOn: data.happenOn,
    hours: data.hours,
    status: TodoStatus.InProgress,
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
