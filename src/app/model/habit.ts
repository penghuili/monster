import { addDays, addWeeks, differenceInCalendarWeeks } from 'date-fns';
import { find, merge } from 'ramda';

import { SortableItem } from './item';
import { isBeforeDay, isWithin, isWithinDay, mapWeekDay, now, startOfWeek, WeekDays } from './time';

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
export interface HabitItem {
  id?: number;
  habitId: number;
  happenDate: number;
  status: HabitStatus;
  updatedAt: number;
}
export interface HabitWithWeekDays {
  habit: Habit;
  progress: WeekDays[];
}
export interface HabitWithItems {
  habit: Habit;
  items: HabitItem[];
}
export enum HabitStatus {
  InProgress,
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
    createdAt: timestamp,
    updatedAt: timestamp,
    position: `${timestamp}3`
  };
}
export function calcHabitProgress(items: HabitItem[], habit: Habit): WeekDays[] {
  const startWeek = startOfWeek(habit.startDate);
  const endWeek = startOfWeek(habit.endDate);
  const weeks = differenceInCalendarWeeks(endWeek, startWeek, {weekStartsOn: 1}) + 1;

  return Array(weeks).fill(1).map((_, i) => {
    const start = addWeeks(startWeek, i).getTime();
    return Array(7).fill(1).reduce((total, curr, index) => {
      const day = addDays(start, index).getTime();
      const weekDay = mapWeekDay(day);
      const doneItem = find(b => isWithinDay(b.happenDate, day), items);
      const shouldDo = habit[weekDay];
      const done = doneItem ? true :
        shouldDo && isBeforeDay(day, now()) && isWithin(day, habit.startDate, habit.endDate) ? false :
        undefined;
      return merge(total, { [weekDay]: done });
    }, {});
  });
}
