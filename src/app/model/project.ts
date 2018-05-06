import { Todo } from '@app/model';
import { addDays, differenceInDays, format } from 'date-fns';

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
  projectId: string;
  startDate?: number;
  endDate?: number;
}
export enum ProjectStatus {
  InProgress,
  Done
}
export interface ChartDataItem {
  name: string;
  series: ChartSeriesDataItem[];
}
export interface ChartSeriesDataItem {
  name:  string | Date;
  value: number;
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
export function getChartData(items: ChartSeriesDataItem[]): ChartSeriesDataItem[] {
  if (!items || items.length === 0) {
    return [];
  }

  let fillEmpty: ChartSeriesDataItem[] = [];
  let prevDay: string;
  let nextDay: string;
  items.forEach(item => {
    if (!prevDay) {
      prevDay = <string>item.name;
    }
    nextDay = format(addDays(prevDay, 1), 'YYYY-MM-DD');
    if (prevDay === item.name) {
      fillEmpty.push(item);
    } else if (nextDay === item.name) {
      fillEmpty.push(item);
      prevDay = item.name;
    } else {
      const diff = differenceInDays(item.name, nextDay);
      const arr = Array(diff).fill(0).map((a, i) => ({
        name: format(addDays(prevDay, i + 1), 'YYYY-MM-DD'),
        value: 0
      }));
      fillEmpty = fillEmpty.concat(arr);
      fillEmpty.push(item);
      prevDay = <string>item.name;
    }
  });
  const accumulated: ChartSeriesDataItem[] = [];
  let sum = 0;
  let day: string;
  const len = fillEmpty.length;
  fillEmpty.forEach((item, index) => {
    if (!day) {
      day = <string>item.name;
    }
    if (day !== item.name) {
      accumulated.push({ name: new Date(day), value: sum });
      day = <string>item.name;
    }
    sum = sum + item.value;
    if (index === len - 1) {
      accumulated.push({ name: new Date(item.name), value: sum });
    }
  });

  return accumulated;
}
