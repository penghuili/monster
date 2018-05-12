import { Component, Input } from '@angular/core';
import { now, Record } from '@app/model';

@Component({
  selector: 'mst-record-item',
  templateUrl: './record-item.component.html',
  styleUrls: ['./record-item.component.scss']
})
export class RecordItemComponent {
  @Input() record: Record;
  @Input() recordNext: Record;
}
