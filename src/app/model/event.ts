import { ProjectStatus } from './project';
import { now } from './time';
import { TodoStatus } from './todo';

export interface Event {
  id?: number;
  refId: number;
  createdAt: number;
  type: EventType;
  action: string;
  oldValue?: any;
  newValue?: any;
  description?: string;
}
export enum EventType {
  Todo,
  Project,
  Subproject,
  Record,
  Habit
}
export const MonsterEvents = {
  CreateProject: 'CreateProject',
  ChangeProjectStartDate: 'ChangeProjectStartDate',
  ChangeProjectEndDate: 'ChangeProjectEndDate',
  InProgressProject: 'InProgressProject',
  SomedayProject: 'SomedayProject',
  DoneProject: 'DoneProject',

  CreateSubproject: 'CreateSubproject',
  InProgressSubproject: 'InProgressSubproject',
  SomedaySubproject: 'SomedaySubproject',
  DoneSubproject: 'DoneSubproject',

  CreateTodo: 'CreateTodo',
  ChangeTodoHappenDate: 'ChangeTodoHappenDate',
  ChangeTodoExpectedTime: 'ChangeTodoExpectedTime',
  InProgressTodo: 'InProgressTodo',
  WaitingTodo: 'WaitingTodo',
  SomedayTodo: 'SomedayTodo',
  DoneTodo: 'DoneTodo',
  WontDoTodo: 'WontDoTodo',
  StartTodo: 'StartTodo',
  StopTodo: 'StopTodo',
  CurrentThougntTodo: 'CurrentThougntTodo',

  CreateRecord: 'CreateRecord',

  FinishHabit: 'FinishHabit'
};

export function createEvent(data: any): Event {
  const timestamp = now();
  return {
    refId: data.refId,
    createdAt: timestamp,
    type: data.type,
    action: data.action,
    oldValue: data.oldValue,
    newValue: data.newValue
  };
}
