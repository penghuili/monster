import { Pipe, PipeTransform } from '@angular/core';
import { ProjectStatus } from '@app/model';

@Pipe({
  name: 'projectStatus'
})
export class ProjectStatusPipe implements PipeTransform {
  transform(value: ProjectStatus): string {
    switch (value) {
      case ProjectStatus.Done:
        return 'done';
      case ProjectStatus.Someday:
        return 'someday';
      default:
        return 'in progress';
    }
  }
}
