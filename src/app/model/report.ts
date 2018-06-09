import { getStartEnd, isBeforeToday, isWithin, TimeRangeType } from './time';
import { isFinishTooEarly, isFinishTooLate, Todo, TodoStatus } from './todo';

export interface Report {
  id?: number;
  type: TimeRangeType;
  date: number;
  // todo counts
  planned: number;
  done: number;
  wontDo: number;
  finishTooLate: number;
  finishTooEarly: number;
  addedLater: number;
  beforeToday: number;
  // time in minute
  plannedTime: number;
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
    wontDo: todos.filter(a => isWithin(a.finishAt, start, end) && a.status === TodoStatus.WontDo).length,
    finishTooLate: todos.filter(a => isWithin(a.finishAt, start, end) && isFinishTooLate(a)).length,
    finishTooEarly: todos.filter(a => isWithin(a.finishAt, start, end) && isFinishTooEarly(a)).length,
    addedLater: todosWithinRange.filter(a => a.addedLater).length,
    beforeToday: todos.filter(a => isBeforeToday(a.happenDate)).length,
    plannedTime: todosWithinRange.reduce((total, curr) => total + curr.expectedTime, 0),
    usedTimeOfTimeRange
  };
}
