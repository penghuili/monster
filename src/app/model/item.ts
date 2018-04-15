import { ALL, INBOX } from '@app/static';
import { append, concat, drop, find, findIndex, insert, merge, update } from 'ramda';

import { now } from './time';

export interface Item {
  id?: string;
  title?: string;
  createdAt?: number;
  updatedAt?: number;
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
export function swapItems(a: Item, b: Item, items: Item[]) {
  if (!a || !b) {
    return items;
  }
  const aIndex = findIndex(i => i.id === a.id, items);
  const bIndex = findIndex(i => i.id === b.id, items);
  if (aIndex < 0 || bIndex < 0) {
    return items;
  }
  const updateA = update(aIndex, b, items);
  const updateB = update(bIndex, a, updateA);
  return updateB;
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

