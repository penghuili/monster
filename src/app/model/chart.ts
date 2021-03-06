import { addDays, differenceInDays, format } from 'date-fns';

export interface ChartDataItem {
  name: string;
  series: ChartSeriesDataItem[];
}
export interface ChartSeriesDataItem {
  name:  any;
  value: number;
}

export function createChartData(items: ChartSeriesDataItem[]): ChartSeriesDataItem[] {
  if (!items || items.length === 0) {
    return [];
  }

  let fillEmpty: ChartSeriesDataItem[] = [];
  let prevDay: string;
  let nextDay: string;
  items.forEach(item => {
    if (!prevDay) {
      prevDay = <string>item.name;
    }
    nextDay = format(addDays(prevDay, 1), 'YYYY-MM-DD');
    if (prevDay === item.name) {
      fillEmpty.push(item);
    } else if (nextDay === item.name) {
      fillEmpty.push(item);
      prevDay = item.name;
    } else {
      const diff = differenceInDays(item.name, nextDay);
      const arr = Array(diff).fill(0).map((a, i) => ({
        name: format(addDays(prevDay, i + 1), 'YYYY-MM-DD'),
        value: 0
      }));
      fillEmpty = fillEmpty.concat(arr);
      fillEmpty.push(item);
      prevDay = <string>item.name;
    }
  });
  const accumulated: ChartSeriesDataItem[] = [];
  let sum = 0;
  let day: string;
  const len = fillEmpty.length;
  fillEmpty.forEach((item, index) => {
    if (!day) {
      day = <string>item.name;
    }
    if (day !== item.name) {
      accumulated.push({ name: new Date(day), value: sum });
      day = <string>item.name;
    }
    sum = sum + item.value;
    if (index === len - 1) {
      accumulated.push({ name: new Date(item.name), value: sum });
    }
  });

  return accumulated;
}
