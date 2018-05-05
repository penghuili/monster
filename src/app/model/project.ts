import { Todo } from '@app/model';

import { Item, SortableItem } from './item';
import { now } from './time';

interface ProjectBase extends SortableItem {
  startDate: number;
  endDate: number;
  result: string;
  status: ProjectStatus;
  note?: string;
  finishAt?: number;
}
export interface Project extends ProjectBase {
  subprojects: Subproject[];
}
export interface Subproject extends ProjectBase {
  todos: Todo[];
}

export enum ProjectStatus {
  InProgress,
  Done
}

export function createProject(data: any): Project {
  const timestamp = now();
  return {
    id: `p${timestamp}`,
    title: data.title,
    startDate: data.startDate,
    endDate: data.endDate,
    result: data.result,
    subprojects: data.subprojects,
    note: data.note,
    status: ProjectStatus.InProgress,
    createdAt: timestamp,
    updatedAt: timestamp,
    position: `${timestamp}3`
  };
}
export function createSubproject(data: any): Subproject {
  const timestamp = now();
  return {
    id: `sp${timestamp}`,
    title: data.title,
    startDate: data.startDate,
    endDate: data.endDate,
    result: data.result,
    todos: data.todos,
    note: data.note,
    status: ProjectStatus.InProgress,
    createdAt: timestamp,
    updatedAt: timestamp,
    position: `${timestamp}3`
  };
}
