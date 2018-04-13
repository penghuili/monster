import { ALL } from '@app/static';

import { Item } from './item';
import { now } from './utils';

export type TagCategory = Item;
export interface Tag extends Item {
  categoryId: string;
}

export function createTagCategory(data: TagCategory): TagCategory {
  const timestamp = now();
  return {
    id: `tc${timestamp}`,
    title: data.title,
    createdAt: timestamp
  };
}
export function createOneTag(data: Tag): Tag {
  const timestamp = now();
  return {
    id: `ta${timestamp}`,
    categoryId: data.categoryId,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}
export function filterTags(tags: Tag[], category?: TagCategory): Tag[] {
  if (!tags || !category || category.id === ALL.id) {
    return tags;
  } else {
    return tags.filter(a => a.categoryId === category.id);
  }
}
