import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mstAdd0'
})
export class Add0Pipe implements PipeTransform {

  transform(value: number): string {
    return value > 10 ? value.toString() : `0${value}`;
  }

}
