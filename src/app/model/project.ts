import { Todo } from '@app/model';

import { SortableItem } from './item';
import { now } from './time';

export interface ProjectBase extends SortableItem {
  result: string;
  status: ProjectStatus;
  note?: string;
  finishAt?: number;
}
export interface Project extends ProjectBase {
  startDate: number;
  endDate: number;
}
export interface Subproject extends ProjectBase {
  projectId: number;
}
export interface ProjectWithSubproject {
  project: Project;
  subproject: Subproject;
}
export interface ProjectWithTodos {
  project: Project;
  todos: Todo[];
}
export enum ProjectStatus {
  InProgress,
  Someday,
  Done
}


export function createProject(data: any): Project {
  const timestamp = now();
  return {
    title: data.title,
    startDate: data.startDate,
    endDate: data.endDate,
    result: data.result,
    note: data.note,
    status: data.status,
    createdAt: timestamp,
    updatedAt: timestamp,
    position: `${timestamp}3`
  };
}
export function createSubproject(data: any): Subproject {
  const timestamp = now();
  return {
    projectId: data.projectId,
    title: data.title,
    result: data.result,
    note: data.note,
    status: data.status,
    createdAt: timestamp,
    updatedAt: timestamp,
    position: `${timestamp}3`
  };
}
