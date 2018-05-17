import { Pipe, PipeTransform } from '@angular/core';
import { now } from '@app/model';
import { differenceInCalendarDays } from 'date-fns';

@Pipe({
  name: 'daysDiff'
})
export class DaysDiffPipe implements PipeTransform {

  transform(value: number): any {
    const diff = differenceInCalendarDays(now(), value);
    return diff === 0 ? '1 day' :
      diff > 0 ? `${diff + 1} days` : null;
  }

}
