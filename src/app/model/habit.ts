import { SortableItem } from './item';
import { now, WeekDays } from './time';

export interface Habit extends SortableItem {
  result: string;
  startDate: number;
  endDate: number;
  doneForToday?: boolean;

  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}
export interface HabitWithProgress {
  habit: Habit;
  progress: WeekDays[];
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
    createdAt: timestamp,
    updatedAt: timestamp,
    position: `${timestamp}3`
  };
}
