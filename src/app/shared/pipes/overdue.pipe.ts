import { Pipe, PipeTransform } from '@angular/core';
import { now } from '@app/model';
import { format } from 'date-fns';

@Pipe({
  name: 'overdue'
})
export class OverduePipe implements PipeTransform {

  transform(value: number, args?: any): any {
    return format(value, 'YYYYMMDD') < format(now(), 'YYYYMMDD');
  }

}
