import { Pipe, PipeTransform } from '@angular/core';
import { Todo, TodoStatus } from '@app/model';

@Pipe({
  name: 'expectedTime'
})
export class ExpectedTimePipe implements PipeTransform {

  transform(value: Todo[]): any {
    if (value && value.length > 0) {
      return value
        .filter(a => a.expectedTime !== 0 && a.status === TodoStatus.InProgress)
        .reduce((sum, a) => sum + a.expectedTime, 0);
    } else {
      return 0;
    }
  }

}
