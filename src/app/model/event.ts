import { now } from './time';

export interface Event {
  id?: number;
  refId: number;
  createdAt: number;
  type: EventType;
  action: string;
  data?: any;
  oldValue?: any;
  newValue?: any;
  description?: string;
}
export enum EventType {
  Todo,
  Project,
  Subproject,
  Thought,
  Habit,
  Book,
  TodoThought
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

  CreateRecord: 'CreateRecord',

  FinishHabit: 'FinishHabit',

  CreateBook: 'CreateBook'
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
