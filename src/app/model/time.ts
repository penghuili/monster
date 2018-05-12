import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfWeek as endOfWeekFromLib,
  startOfDay,
  startOfMonth,
  startOfToday as startOfTodayFromLib,
  startOfWeek as startOfWeekFromLib,
} from 'date-fns';

import { DatepickerMode } from '../shared/datepicker/model';

export function now(): number {
  return new Date().getTime();
}
export function createDate(year: number, month: number, day: number): number {
  const n = new Date();
  n.setFullYear(year);
  n.setMonth(month);
  n.setDate(day);
  return n.getTime();
}
export function add0(a: number): string {
  return a >= 0 && a <= 9 ? `0${a}` : a.toString();
}
export function startOfToday(): number {
  return startOfTodayFromLib().getTime();
}
export function endOfToday(): number {
  return endOfDay(now()).getTime();
}
export function endofTomorrow(): number {
  return endOfDay(addDays(now(), 1)).getTime();
}
export function endOfThisWeek(): number {
  return endOfDay(addDays(now(), 7)).getTime();
}
export function startOfWeek(date: number): number {
  return startOfWeekFromLib(date, {weekStartsOn: 1}).getTime();
}
export function endOfWeek(date: number): number {
  return endOfWeekFromLib(date, {weekStartsOn: 1}).getTime();
}
export function isBeforeToday(date: number): boolean {
  return date < startOfToday();
}
export function isAfterToday(date: number): boolean {
  return date > endOfToday();
}
export function isTodayOrBefore(date: number): boolean {
  return date < endOfToday();
}
export function isWithinDay(date: number, targetDay: number): boolean {
  return date > startOfDay(targetDay).getTime() && date < endOfDay(targetDay).getTime();
}
export function isBeforeDay(date: number, targetDay: number): boolean {
  return date < new Date(targetDay).getTime();
}
export function isAfterDay(date: number, targetDay: number): boolean {
  return date > new Date(targetDay).getTime();
}
export function getStartEnd(date: number, mode: DatepickerMode): number[] {
  if (mode === DatepickerMode.Week) {
    return [startOfWeek(date), endOfWeek(date)];
  } else if (mode === DatepickerMode.Month) {
    return [startOfMonth(date).getTime(), endOfMonth(date).getTime()];
  } else {
    return [startOfDay(date).getTime(), endOfDay(date).getTime()];
  }
}
