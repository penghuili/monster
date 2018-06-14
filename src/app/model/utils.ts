import { DndDragImageOffsetFunction } from 'ngx-drag-drop';

import { environment } from '../../environments/environment';

export function getIconUrl(icon: string): string {
  return environment.iconUrl + icon + '.svg';
}
export const MonsterStorage = {
  get(key: string) {
    return JSON.parse(localStorage.getItem(key));
  },
  set(key: string, value: any) {
    if (typeof value === 'undefined') {
      localStorage.setItem(key, JSON.stringify(null));
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  remove(key: string) {
    localStorage.removeItem(key);
  }
};
export function getDragImageOffsetFunction(): DndDragImageOffsetFunction {
  return () => ({ x: -150, y: 0 });
}
export function paragraphString(text: string): string[] {
  return !text ? [] : text.split('\n')
    .map(a => a.trim())
    .filter(a => !!a);
}
