import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Event, MonsterEvents, Project } from '@app/model';
import { ROUTES } from '@app/static';

@Component({
  selector: 'mst-activity-item-project',
  templateUrl: './activity-item-project.component.html',
  styleUrls: ['./activity-item-project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityItemProjectComponent {
  @Input() activity: Event;
  @Input() data: Project;

  MonsterEvents = MonsterEvents;
  ROUTES = ROUTES;
}
