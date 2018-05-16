import { Pipe, PipeTransform } from '@angular/core';
import { TimeRangeType } from '@app/model';

@Pipe({
  name: 'timeRangeType'
})
export class TimeRangeTypePipe implements PipeTransform {

  transform(value: TimeRangeType): any {
    switch (value) {
      case TimeRangeType.Day:
        return 'daily';
      case TimeRangeType.Week:
        return 'weekly';
      case TimeRangeType.Month:
        return 'monthly';
      case TimeRangeType.Quarter:
        return 'quarterly';
      case TimeRangeType.Year:
        return 'yearly';
      default:
        throw Error('invalid time range type for timeRangePipe.');
    }
  }

}
