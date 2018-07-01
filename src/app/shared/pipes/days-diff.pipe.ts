import { Pipe, PipeTransform } from '@angular/core';
import { now } from '@app/model';
import { differenceInCalendarDays } from 'date-fns';

@Pipe({
  name: 'daysDiff'
})
export class DaysDiffPipe implements PipeTransform {

  transform(value: number, endDate?: number): any {
    endDate = endDate || now();
    const diff = differenceInCalendarDays(endDate, value);
    return diff === 0 ? '1 day' :
      diff > 0 ? `${diff + 1} days` : null;
  }

}
