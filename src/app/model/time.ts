import {
  endOfDay,
  endOfMonth,
  endOfQuarter,
  endOfTomorrow,
  endOfWeek as endOfWeekFromLib,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfToday as startOfTodayFromLib,
  startOfWeek as startOfWeekFromLib,
  startOfYear,
} from 'date-fns';

export enum TimeRangeType {
  Day,
  Week,
  Month,
  Quarter,
  Year
}

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
  return endOfTomorrow().getTime();
}
export function endOfThisWeek(): number {
  return endOfWeek(now());
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
export function isWithin(date: number, start: number, end?: number): boolean {
  const startDate = startOfDay(start).getTime();
  const endDate = end ? endOfDay(end).getTime() : Infinity;
  return date > startDate && date < endDate;
}
export function isBeforeDay(date: number, targetDay: number): boolean {
  return date < new Date(targetDay).getTime();
}
export function isAfterDay(date: number, targetDay: number): boolean {
  return date > new Date(targetDay).getTime();
}
export function getStartEnd(date: number, mode: TimeRangeType): number[] {
  if (mode === TimeRangeType.Day) {
    return [startOfDay(date).getTime(), endOfDay(date).getTime()];
  } else if (mode === TimeRangeType.Week) {
    return [startOfWeek(date), endOfWeek(date)];
  } else if (mode === TimeRangeType.Month) {
    return [startOfMonth(date).getTime(), endOfMonth(date).getTime()];
  } else if (mode === TimeRangeType.Quarter) {
    return [startOfQuarter(date).getTime(), endOfQuarter(date).getTime()];
  } else if (mode === TimeRangeType.Year) {
    return [startOfYear(date).getTime(), endOfYear(date).getTime()];
  } else {
    throw Error('invalid time range.');
  }
}
export function milisecondToMinute(milisec: number): number {
  return milisec / (1000 * 60);
}
