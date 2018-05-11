import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortText'
})
export class ShortTextPipe implements PipeTransform {

  transform(value: string, args?: number): any {
    args = args || 30;
    const len = value.length;
    return len > args ? value.slice(0, args) + '..' : value;
  }

}
