import { Pipe, PipeTransform } from '@angular/core';
import { TodoStatus } from '@app/model';

@Pipe({
  name: 'todoStatus'
})
export class TodoStatusPipe implements PipeTransform {
  transform(value: TodoStatus): string {
    switch (value) {
      case TodoStatus.Done:
        return 'done';
      case TodoStatus.Someday:
        return 'someday';
      case TodoStatus.Waiting:
        return 'waiting';
      default:
        return 'in progress';
    }
  }
}
