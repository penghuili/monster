import { getStartEnd, isBeforeToday, isWithin, TimeRangeType } from './time';
import { isFinishTooEarly, isFinishTooLate, Todo, TodoStatus } from './todo';

export interface Report {
  id?: number;
  type: TimeRangeType;
  date: number;
  // todo counts
  planned: number;
  done: number;
  doneOfCurrentRange: number;
  wontDo: number;
  wontDoOfCurrentRange: number;
  finishTooLate: number;
  finishTooEarly: number;
  addedLater: number;
  beforeToday: number;
  // in seconds
  plannedTime: number;
  // in seconds
  usedTimeOfTimeRange: number;
  summary?: string;
}
export interface ReportWithTodos {
  report: Report;
  todos: Todo[];
}

export function createReport(date: number, type: TimeRangeType, todos: Todo[], usedTimeOfTimeRange: number): Report {
  if (!todos || todos.length === 0) {
    return null;
  }
  const [start, end] = getStartEnd(date, type);
  const todosWithinRange = todos.filter(a => isWithin(a.happenDate, start, end));

  return {
    date: date,
    type: type,
    planned: todosWithinRange.length,
    done: todos.filter(a => isWithin(a.finishAt, start, end) && a.status === TodoStatus.Done).length,
    doneOfCurrentRange: todosWithinRange.filter(a => isWithin(a.finishAt, start, end) && a.status === TodoStatus.Done).length,
    wontDo: todos.filter(a => isWithin(a.finishAt, start, end) && a.status === TodoStatus.WontDo).length,
    wontDoOfCurrentRange: todosWithinRange.filter(a => isWithin(a.finishAt, start, end) && a.status === TodoStatus.WontDo).length,
    finishTooLate: todos.filter(a => isWithin(a.finishAt, start, end) && isFinishTooLate(a)).length,
    finishTooEarly: todos.filter(a => isWithin(a.finishAt, start, end) && isFinishTooEarly(a)).length,
    addedLater: todosWithinRange.filter(a => a.addedLater).length,
    beforeToday: todos.filter(a => isBeforeToday(a.happenDate)).length,
    plannedTime: todosWithinRange.reduce((total, curr) => total + curr.expectedTime, 0),
    usedTimeOfTimeRange
  };
}
export function getFinishedCount(report: Report): number {
  const done = report && report.done !== undefined ? report.done : 0;
  const wontDo = report && report.wontDo !== undefined ? report.wontDo : 0;
  return done + wontDo;
}
export function getFinishedOfSelectedRangeCount(report: Report): number {
  const done = report && report.doneOfCurrentRange !== undefined ? report.doneOfCurrentRange : 0;
  const wontDo = report && report.wontDoOfCurrentRange !== undefined ? report.wontDoOfCurrentRange : 0;
  return done + wontDo;
}
export function getFinishedPlannedRatio(report: Report) {
  if (report && report.planned) {
    return getFinishedCount(report) / report.planned;
  } else if (report && !report.planned && getFinishedCount(report)) {
    return 1;
  } else {
    return 0;
  }
}
export function getFinishedOfSelectedRangePlannedRatio(report: Report) {
  if (report && report.planned) {
    return getFinishedOfSelectedRangeCount(report) / report.planned;
  } else if (report && !report.planned && getFinishedOfSelectedRangeCount(report)) {
    return 1;
  } else {
    return 0;
  }
}
