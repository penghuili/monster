import { now } from './time';

export interface Thought {
  id?: number;
  title: string;
  createdAt: number;
}
export function createThought(data: any): Thought {
  return {
    title: data.title,
    createdAt: now()
  };
}
