export interface TodoBase {
  createdAt: number;
  updatedAt?: number;
  title: string;
  status: TodoStatus;
  happenOn: TodoHappenOn;
  description?: string;
}
export interface Todo extends TodoBase {
  subTasks?: TodoBase[];
}

export enum TodoHappenOn {
  Today,
  Tomorrow,
  Upcoming,
  Someday
}
export enum TodoStatus {
  Inprogress,
  Done
}
