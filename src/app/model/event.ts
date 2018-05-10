export interface Event {
  id?: number;
  refId: number;
  createdAt: number;
  type: EventType;
  action: string;
  oldValue?: any;
  newValue?: any;
}
export enum EventType {
  Todo,
  Project,
  Subproject
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
  StopTodo: 'StopTodo'
};

export function createEvent(data: any): Event {
  return {
    refId: data.refId,
    createdAt: data.createdAt,
    type: data.type,
    action: data.action,
    oldValue: data.oldValue,
    newValue: data.newValue
  };
}
