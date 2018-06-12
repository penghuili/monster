import { addDays } from 'date-fns';
import { range } from 'ramda';

import { SortableItem } from './item';
import { now } from './time';

export interface Book extends SortableItem {
  chapters: number;
  chaptersPerDay: number;
  startDate: number;
  endDate: number;
  finished: boolean;
  note?: string;
}
export interface BookItem {
  id?: number;
  bookId: number;
  chapters: string;
  happenDate: number;
  createdAt: number;
  finished: boolean;
}

export function createBook(data: any): Book {
  const timestamp = now();
  return {
    title: data.title,
    chapters: data.chapters,
    chaptersPerDay: data.chaptersPerDay,
    startDate: data.startDate,
    endDate: data.endDate,
    finished: false,
    note: data.note,
    createdAt: timestamp,
    updatedAt: timestamp,
    position: `${timestamp}3`
  };
}
export function createBookItems(book: Book): BookItem[] {
  const timestamp = now();
  const days = Math.ceil(book.chapters / book.chaptersPerDay);
  return Array(days).fill(1).map((day, index) => {
    const happenDate = addDays(book.startDate, index).getTime();
    const chaptersPerDay = range(index * book.chaptersPerDay + 1, (index + 1) * book.chaptersPerDay + 1);
    const len = chaptersPerDay.length;
    const chapters = chaptersPerDay.reduce((sum, curr, i) => i === len - 1 ? `${sum}${curr}` : `${sum}${curr}, `, '');

    return {
      bookId: book.id,
      chapters: `${book.title} ${chapters}`,
      happenDate: happenDate,
      createdAt: timestamp,
      finished: false
    };
  });
}
