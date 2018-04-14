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

export function add0(a: number): string {
  return a >= 0 && a <= 9 ? `0${a}` : a.toString();
}
export function dragImageOffsetFunction(): DndDragImageOffsetFunction {
  return () => ({ x: -150, y: 0 });
}
