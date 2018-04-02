import { INBOX } from '../static/config';

export interface Todo {
  id?: string;
  title?: string;
  projectId?: string;
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
    projectId: data.projectId || INBOX.id,
    note: data.note,
    happenOn: data.happenOn,
    hours: data.hours,
    status: TodoStatus.InProgress,
    createdAt: data.createdAt
  };
}
export function filterTodo(todos: Todo[], projectId?: string): Todo[] {
  if (!todos || !projectId) {
    return todos;
  } else {
    return todos.filter(a => a.projectId === projectId);
  }
}
