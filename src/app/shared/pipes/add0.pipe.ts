import { Pipe, PipeTransform } from '@angular/core';
import { add0 } from '@app/model';

@Pipe({
  name: 'mstAdd0'
})
export class Add0Pipe implements PipeTransform {

  transform(value: number): string {
    return add0(value);
  }

}
