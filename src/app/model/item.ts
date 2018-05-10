import { find, findIndex, insert, merge } from 'ramda';

import { now } from './time';

export interface Item {
  id?: number;
  title?: string;
  createdAt?: number;
  updatedAt?: number;
}
export interface SortableItem extends Item {
  position?: string;
  nextId?: number;
  prevId?: number;
}
export function swapItems(dragged: SortableItem, dropped: SortableItem, items: SortableItem[]): SortableItem[] {
  const indexDragged = findIndex(a => a.id === dragged.id, items);
  const indexDropped = findIndex(a => a.id === dropped.id, items);
  const updatedItems: SortableItem[] = [];
  if (indexDragged > -1 && indexDropped > -1) {
    let start: SortableItem;
    let end: SortableItem;
    let index3: number;
    if (dragged.prevId && !dragged.nextId) {
      const draggedPrevIndex = findIndex(a => a.id === dragged.prevId, items);
      if (draggedPrevIndex > -1) {
        items[draggedPrevIndex].nextId = undefined;
        updatedItems.push(items[draggedPrevIndex]);
      }
    }
    if (dragged.nextId && !dragged.prevId) {
      const draggedNextIndex = findIndex(a => a.id === dragged.nextId, items);
      if (draggedNextIndex > -1) {
        items[draggedNextIndex].prevId = undefined;
        updatedItems.push(items[draggedNextIndex]);
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
      updatedItems.push(dragged);
      updatedItems.push(end);
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
      updatedItems.push(dragged);
      updatedItems.push(start);
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
      updatedItems.push(start);
      updatedItems.push(dragged);
      updatedItems.push(end);
    }
    return updatedItems;
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
export function sortByPosition(items: SortableItem[]): SortableItem[] {
  return items.sort((a, b) => b.position > a.position ? 1 : -1);
}
function isItemDragged(item: SortableItem): boolean {
  return !!item.prevId || !!item.nextId || item.position !== item.createdAt + '3';
}
