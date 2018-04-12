import { Item } from './item';
import { now } from './utils';

export interface Project extends Item {
  note?: string;
  status?: ProjectStatus;
  finishAt?: number;
}

export enum ProjectStatus {
  InProgress,
  Archive
}

export function createProject(data: Project): Project {
  const timestamp = now();
  return {
    id: `p${timestamp}`,
    title: data.title,
    note: data.note,
    status: ProjectStatus.InProgress,
    createdAt: data.createdAt
  };
}
