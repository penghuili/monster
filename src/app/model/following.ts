import { SortableItem } from './item';
import { now } from './time';

export interface Following extends SortableItem {
  status: FollowingStatus;
  hasPoints: boolean;
}
export interface FollowingItem {
  id?: number;
  followingId: number;
  note: string;
  createdAt: number;
  points?: number;
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
    hasPoints: data.hasPoints,
    createdAt: timestamp,
    updatedAt: timestamp,
    position: `${timestamp}3`
  };
}
