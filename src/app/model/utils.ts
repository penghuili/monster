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
