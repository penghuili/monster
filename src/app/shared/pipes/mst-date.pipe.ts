import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { isToday, isTomorrow, isYesterday } from 'date-fns';

@Pipe({
  name: 'mstDate'
})
export class MstDatePipe implements PipeTransform {

  transform(value: number, args?: any): any {
    if (!value) {
      return null;
    } else if (isToday(value)) {
      return 'today';
    } else if (isYesterday(value)) {
      return 'yesterday';
    } else if (isTomorrow(value)) {
      return 'tomorrow';
    } else {
      const pipe = new DatePipe('en');
      return pipe.transform(value, args);
    }
  }

}
