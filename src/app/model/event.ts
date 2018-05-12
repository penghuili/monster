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
  Record
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

  CreateRecord: 'CreateRecord'
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
export function mapTodoStatusEvent(status: TodoStatus): string {
  switch (status) {
    case TodoStatus.InProgress:
      return MonsterEvents.InProgressTodo;
    case TodoStatus.Waiting:
      return MonsterEvents.WaitingTodo;
    case TodoStatus.Someday:
      return MonsterEvents.SomedayTodo;
    case TodoStatus.Done:
      return MonsterEvents.DoneTodo;
    case TodoStatus.WontDo:
      return MonsterEvents.WontDoTodo;
    default:
      throw Error('invalid todo status');
  }
}
export function mapProjectStatusEvent(status: ProjectStatus): string {
  switch (status) {
    case ProjectStatus.InProgress:
      return MonsterEvents.InProgressTodo;
    case ProjectStatus.Someday:
      return MonsterEvents.SomedayTodo;
    case ProjectStatus.Done:
      return MonsterEvents.DoneTodo;
    default:
      throw Error('invalid project status');
  }
}
