import { Pipe, PipeTransform } from '@angular/core';
import { add0 } from '@app/model';

@Pipe({
  name: 'secondFormatter'
})
export class SecondFormatterPipe implements PipeTransform {

  transform(value: number): any {
    return `${add0(this.getHours(value))}:${add0(this.getMinutes(value))}:${add0(this.getSeconds(value))}`;
  }

  private getHours(duration: number): number {
    return duration === undefined ? 0 : Math.floor(duration / 3600);
  }
  private getMinutes(duration: number): number {
    return duration === undefined ? 0 : Math.floor((duration - this.getHours(duration) * 3600) / 60);
  }
  private getSeconds(duration: number): number {
    return duration === undefined ? 0 : duration - this.getHours(duration) * 3600 - this.getMinutes(duration);
  }

}
