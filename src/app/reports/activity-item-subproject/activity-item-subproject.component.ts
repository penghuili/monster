import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Event, MonsterEvents, Subproject } from '@app/model';
import { ROUTES } from '@app/static';

@Component({
  selector: 'mst-activity-item-subproject',
  templateUrl: './activity-item-subproject.component.html',
  styleUrls: ['./activity-item-subproject.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityItemSubprojectComponent {
  @Input() activity: Event;
  @Input() data: Subproject;

  MonsterEvents = MonsterEvents;
  ROUTES = ROUTES;
}
