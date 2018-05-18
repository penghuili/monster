import { SortableItem } from './item';
import { now } from './time';

export interface Habit extends SortableItem {
  result: string;
  status: HabitStatus;
  finishAt?: number;
  startDate: number;
  endDate: number;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}
export enum HabitStatus {
  InProgress,
  Someday,
  Done
}

export function createHabit(data: any): Habit {
  const timestamp = now();
  return {
    title: data.title,
    startDate: data.startDate,
    endDate: data.endDate,
    result: data.result,
    monday: data.monday,
    tuesday: data.tuesday,
    wednesday: data.wednesday,
    thursday: data.thursday,
    friday: data.friday,
    saturday: data.saturday,
    sunday: data.sunday,
    status: data.status,
    createdAt: timestamp,
    updatedAt: timestamp,
    position: `${timestamp}3`
  };
}
