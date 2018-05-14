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
export function repositionItems(items: SortableItem[]): SortableItem[] {
  const dragged = items[0];
  const dropped = items[1];
  const draggedIndexPrev = items[2];
  const draggedIndexNext = items[3];
  const droppedIndexPrev = items[4];
  const droppedIndexNext = items[5];
  const droppedPositionPrev = items[6];
  const droppedPositionNext = items[7];

  const repositioned: SortableItem[] = [];

  if (!dragged || !dropped) {
    return null;
  }

  if (dragged.prevId && !dragged.nextId && draggedIndexPrev) {
    draggedIndexPrev.nextId = undefined;
    repositioned.push(draggedIndexPrev);
  }
  if (dragged.nextId && !dragged.prevId && draggedIndexNext) {
    draggedIndexNext.prevId = undefined;
    repositioned.push(draggedIndexNext);
  }

  let start: SortableItem;
  let end: SortableItem;
  if (dragged.position > dropped.position) {
    start = dropped;
    end = droppedPositionNext || droppedIndexNext;
  } else {
    start = droppedPositionPrev || droppedIndexPrev;
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

    repositioned.push(end);
    repositioned.push(dragged);
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

    repositioned.push(start);
    repositioned.push(dragged);
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

    repositioned.push(start);
    repositioned.push(end);
    repositioned.push(dragged);
  }

  return repositioned;
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
