import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { endOfWeek, startOfWeek } from '@app/model';

@Pipe({
  name: 'week'
})
export class WeekPipe implements PipeTransform {

  transform(value: number): any {
    if (isNaN(value)) {
      return null;
    }
    value = +value;
    const datePipe = new DatePipe('en');
    const start = startOfWeek(value);
    const end = endOfWeek(value);
    return `${datePipe.transform(start, 'shortDate')} - ${datePipe.transform(end, 'shortDate')}`;
  }

}
