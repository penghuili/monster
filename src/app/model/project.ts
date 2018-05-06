import { Todo } from '@app/model';

import { Item, SortableItem } from './item';
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
  projectId: string;
  startDate?: number;
  endDate?: number;
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
    projectId: data.projectId,
    title: data.title,
    result: data.result,
    note: data.note,
    status: ProjectStatus.InProgress,
    createdAt: timestamp,
    updatedAt: timestamp,
    position: `${timestamp}3`
  };
}
