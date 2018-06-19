import { Pipe, PipeTransform } from '@angular/core';
import { FollowingStatus } from '@app/model';

@Pipe({
  name: 'followingStatus'
})
export class FollowingStatusPipe implements PipeTransform {
  transform(value: FollowingStatus): string {
    switch (value) {
      case FollowingStatus.Done:
        return 'done';
      case FollowingStatus.Someday:
        return 'someday';
      default:
        return 'in progress';
    }
  }
}
