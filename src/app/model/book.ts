import { MonsterEvents } from './event';
import { SortableItem } from './item';
import { now } from './time';
import { Todo } from './todo';

export interface Book extends SortableItem {
  chapters: number;
  chaptersPerDay: number;
  startDate: number;
  endDate: number;
  note?: string;
}

export function createBook(data: any): Book {
  const timestamp = now();
  return {
    title: data.title,
    chapters: data.chapters,
    chaptersPerDay: data.chaptersPerDay,
    startDate: data.startDate,
    endDate: data.endDate,
    note: data.note,
    createdAt: timestamp,
    updatedAt: timestamp,
    position: `${timestamp}3`
  };
}
