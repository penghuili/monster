import { isBeforeToday, TimeRangeType } from './time';
import { isFinished, isFinishTooEarly, isFinishTooLate, Todo, TodoStatus } from './todo';

export interface Report {
  id?: number;
  type: TimeRangeType;
  date: number;
  // todo counts
  planned: number;
  inProgress: number;
  waiting: number;
  wontDo: number;
  done: number;
  finishTooLate: number;
  finishTooEarly: number;
  beforeToday: number;
  beforeTodayNotFinished: number;
  withoutTime: number;
  // time in minute
  plannedTime: number;
  usedTime: number;
  finishedUsedTime: number;
  finishedPlannedTime: number;
  summary?: string;
}

export function createReport(todos: Todo[], date: number, type: TimeRangeType): Report {
  if (!todos || todos.length === 0) {
    return null;
  }
  return {
    date: date,
    type: type,
    planned: todos.length,
    inProgress: todos.filter(a => a.status === TodoStatus.InProgress).length,
    waiting: todos.filter(a => a.status === TodoStatus.Waiting).length,
    wontDo: todos.filter(a => a.status === TodoStatus.WontDo).length,
    done: todos.filter(a => a.status === TodoStatus.Done).length,
    finishTooLate: todos.filter(a => isFinishTooLate(a)).length,
    finishTooEarly: todos.filter(a => isFinishTooEarly(a)).length,
    beforeToday: todos.filter(a => isBeforeToday(a.happenDate)).length,
    beforeTodayNotFinished: todos.filter(a => isBeforeToday(a.happenDate) && !isFinished(a)).length,
    withoutTime: todos.filter(a => !a.expectedTime).length,
    plannedTime: todos.reduce((total, curr) => total + curr.expectedTime, 0),
    usedTime: todos.reduce((total, curr) => total + curr.usedTime, 0),
    finishedUsedTime: todos.filter(a => isFinished(a)).reduce((total, curr) => total + curr.usedTime, 0),
    finishedPlannedTime: todos.filter(a => isFinished(a)).reduce((total, curr) => total + curr.expectedTime, 0)
  };
}
