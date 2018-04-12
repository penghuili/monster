import { concat, filter, find, merge, prepend } from 'ramda';

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
    Array(income.length + source.length).fill(1).forEach(() => {
      const incomeHead = income[0];
      const sourceHead = source[0];
      if (incomeHead && sourceHead) {
        newer = newerItem(incomeHead, sourceHead);
        merged.push(newer);
        if (newer.id === incomeHead.id) {
          income = income.slice(1);
        } else {
          source = source.slice(1);
        }
      } else if (!incomeHead && sourceHead) {
        merged = concat(merged, source);
        return;
      } else if (incomeHead && !sourceHead) {
        merged = concat(merged, income);
        return;
      } else {
        return;
      }
    });

    return merged;
  } else if (income || source) {
    return income || source;
  } else {
    return [];
  }
}

function newerItem(a: Item, b: Item): Item {
  if (!a || !b) {
    return a || b;
  }
  if (a.createdAt > b.createdAt) {
    return a;
  } else if (a.createdAt < b.createdAt) {
    return b;
  } else {
    return +a.updatedAt - +b.updatedAt > 0 ? a : b;
  }
}

