import { Pipe, PipeTransform } from '@angular/core';
import { add0 } from '@app/model';

@Pipe({
  name: 'minuteFormatter'
})
export class MinuteFormatterPipe implements PipeTransform {

  transform(value: number): any {
    return `${add0(this.getHours(value))}:${add0(this.getMinutes(value))}`;
  }

  private getHours(duration: number): number {
    return Math.floor(duration / 60);
  }
  private getMinutes(duration: number): number {
    return duration - this.getHours(duration) * 60;
  }

}
