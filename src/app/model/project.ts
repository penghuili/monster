import { MonsterEvents } from './event';
import { SortableItem } from './item';
import { now } from './time';
import { Todo } from './todo';

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
export interface SubprojectsWithTodos {
  subprojects: Subproject[];
  todos: Todo[];
}
export enum ProjectStatus {
  InProgress,
  Someday,
  Done
}
export interface ProjectTimelineItem {
  name: string;
  start: number;
  end: number;
  finished: boolean;
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
export function mapProjectStatusEvent(status: ProjectStatus): string {
  switch (status) {
    case ProjectStatus.InProgress:
      return MonsterEvents.InProgressTodo;
    case ProjectStatus.Someday:
      return MonsterEvents.SomedayTodo;
    case ProjectStatus.Done:
      return MonsterEvents.DoneTodo;
    default:
      throw Error('invalid project status');
  }
}
