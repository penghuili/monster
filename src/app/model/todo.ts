import { ALL, INBOX } from '../static/config';
import { Project } from './project';

export interface Todo {
  id?: string;
  title?: string;
  project?: Project;
  note?: string;
  happenOn?: number;
  hours?: number;
  status?: TodoStatus;
  finishAt?: number;
  createdAt?: number;
  startAt?: number;
  endAt?: number;
  updatedAt?: number;
}

export enum TodoStatus {
  InProgress,
  Done,
  InTrash
}

export function createTodo(data: Todo): Todo {
  const timestamp = new Date().getTime();
  return {
    id: `t${timestamp}`,
    title: data.title,
    project: data.project || INBOX,
    note: data.note,
    happenOn: data.happenOn,
    hours: data.hours,
    status: TodoStatus.InProgress,
    createdAt: data.createdAt
  };
}
export function filterTodo(todos: Todo[], project?: Project): Todo[] {
  if (!todos || !project || project.id === ALL.id) {
    return todos;
  } else {
    return todos.filter(a => a.project.id === project.id);
  }
}
