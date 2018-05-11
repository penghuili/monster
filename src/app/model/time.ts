import { addDays, endOfDay, startOfDay, startOfToday as startOfTodayFromLib } from 'date-fns';

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
