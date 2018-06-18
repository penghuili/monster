import { SortableItem } from './item';
import { now } from './time';

export interface Following extends SortableItem {
  status: FollowingStatus;
}
export interface FollowingItem {
  id?: number;
  followingId: number;
  note: string;
  createdAt: number;
  score?: number;
}
export enum FollowingStatus {
  InProgress,
  Someday,
  Done
}

export function createFollowing(data: any): Following {
  const timestamp = now();
  return {
    title: data.title,
    status: data.status,
    createdAt: timestamp,
    updatedAt: timestamp,
    position: `${timestamp}3`
  };
}
