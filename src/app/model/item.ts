import { ALL, INBOX } from '@app/static';
import { append, concat, drop, find, findIndex, insert, merge, update } from 'ramda';

import { now } from './time';

export interface Item {
  id?: string;
  title?: string;
  createdAt?: number;
  updatedAt?: number;
}
export interface SortableItem extends Item {
  position?: string;
  nextId?: string;
  prevId?: string;
}

export function mergeItems(income: Item[], source: Item[]): Item[] {
  if (income && source) {
    let merged = [];
    let newer: Item;
    Array(income.length + source.length).fill(1).some(() => {
      const incomeHead = income[0];
      const sourceHead = source[0];
      if (incomeHead && sourceHead) {
        newer = newerItem(incomeHead, sourceHead);
        merged = appendOrUpdate(newer, merged);
        if (incomeHead.id === sourceHead.id) {
          income = drop(1, income);
          source = drop(1, source);
        } else if (newer.id === incomeHead.id) {
          income = drop(1, income);
        } else {
          source = drop(1, source);
        }
        return false;
      } else if (!incomeHead && sourceHead) {
        merged = concat(merged, source);
        return true;
      } else if (incomeHead && !sourceHead) {
        merged = concat(merged, income);
        return true;
      } else {
        return true;
      }
    });

    return merged;
  } else if (income || source) {
    return income || source;
  } else {
    return [];
  }
}
export function swapItems<T>(dragged: SortableItem, dropped: SortableItem, items: SortableItem[]): SortableItem[] {
  const indexDragged = findIndex(a => a.id === dragged.id, items);
  const indexDropped = findIndex(a => a.id === dropped.id, items);
  if (indexDragged > -1 && indexDropped > -1) {
    let start: SortableItem;
    let end: SortableItem;
    let index3: number;
    if (dragged.prevId && !dragged.nextId) {
      const draggedPrevIndex = findIndex(a => a.id === dragged.prevId, items);
      if (draggedPrevIndex > -1) {
        items[draggedPrevIndex].nextId = undefined;
      }
    }
    if (dragged.nextId && !dragged.prevId) {
      const draggedNextIndex = findIndex(a => a.id === dragged.nextId, items);
      if (draggedNextIndex > -1) {
        items[draggedNextIndex].prevId = undefined;
      }
    }
    if (dragged.position > dropped.position) {
      start = dropped;
      if (dropped.nextId || isItemDragged(dropped)) {
        index3 = findIndex(a => a.id === dropped.nextId, items);
        end = items[index3];
      } else {
        index3 = indexDropped + 1;
        end = items[index3];
      }
    } else {
      if (dropped.prevId || isItemDragged(dropped)) {
        index3 = findIndex(a => a.id === dropped.prevId, items);
        start = items[index3];
      } else {
        index3 = indexDropped - 1;
        start = items[index3];
      }
      end = dropped;
    }

    const nextId = dragged.nextId;
    const prevId = dragged.prevId;
    if (!start) {
      if (end.nextId === dragged.id) {
        end.nextId = nextId;
      }
      end.prevId = dragged.id;
      dragged.prevId = undefined;
      dragged.nextId = end.id;

      dragged.position = now().toString() + '3';

      items[indexDragged] = dragged;
      items[indexDropped] = end;
    } else if (!end) {
      if (start.prevId === dragged.id) {
        start.prevId = prevId;
      }
      start.nextId = dragged.id;
      dragged.prevId = start.id;
      dragged.nextId = undefined;

      const position = start.position;
      const len = position.length;
      dragged.position = position.slice(0, len - 1) + (+position[len - 1] - 1);

      items[indexDragged] = dragged;
      items[indexDropped] = start;
    } else {
      if (start.prevId === dragged.id) {
        start.prevId = prevId;
      }
      start.nextId = dragged.id;
      if (end.nextId === dragged.id) {
        end.nextId = nextId;
      }
      end.prevId = dragged.id;
      dragged.prevId = start.id;
      dragged.nextId = end.id;

      const try1 = end.position + '3';
      if (try1 === start.position) {
        const position = start.position;
        const len = position.length;
        dragged.position = position.slice(0, len - 1) + '23';
      } else {
        dragged.position = try1;
      }

      items[indexDragged] = dragged;
      if (start.id === dropped.id) {
        items[indexDropped] = start;
        items[index3] = end;
      } else {
        items[indexDropped] = end;
        items[index3] = start;
      }
    }
    return items;
  }
  return null;
}
export function moveItem(from: number, to: number, items: Item[]) {
  if (!items || from === to) {
    return items;
  }
  const source = merge(items[from], { updatedAt: now() });
  if (!source) {
    return items;
  }
  to = to >= items.length ? items.length - 1 : to;
  const withoutMe = items.filter(a => a.id !== source.id);
  const inserted = insert(to, source, withoutMe);
  return inserted;
}
export function filterDefaults(items: Item[]) {
  return items.filter(a => a.id !== INBOX.id && a.id !== ALL.id);
}
export function dropRepeats(items: Item[]): Item[] {
  if (!items || items.length === 0) {
    return items;
  }
  const updated = [];
  items.forEach(p => {
    const finded = find(a => a.id === p.id, updated);
    if (!finded) {
      updated.push(p);
    }
  });
  return updated;
}

function newerItem(a: Item, b: Item): Item {
  if (!a || !b) {
    return a || b;
  }
  const aUpdate = +a.updatedAt;
  const bUpdate = +b.updatedAt;
  if (aUpdate > bUpdate) {
    return a;
  } else if (aUpdate < bUpdate) {
    return b;
  } else {
    return a.createdAt - b.createdAt > 0 ? a : b;
  }
}
function appendOrUpdate(item: Item, items: Item[]): Item[] {
  if (!item || !items) {
    return items;
  }
  const index = findIndex(a => a.id === item.id, items);
  if (index > -1) {
    return update(index, newerItem(items[index], item), items);
  } else {
    return append(item, items);
  }
}
function isItemDragged(item: SortableItem): boolean {
  return !!item.prevId || !!item.nextId || item.position !== item.createdAt + '3';
}
