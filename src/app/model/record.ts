import { now } from './time';

export interface Record {
  id?: number;
  title: string;
  createdAt: number;
}
export function createRecord(data: any): Record {
  return {
    title: data.title,
    createdAt: now()
  };
}
