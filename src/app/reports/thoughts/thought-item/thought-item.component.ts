import { Component, Input } from '@angular/core';
import { now, Record } from '@app/model';

@Component({
  selector: 'mst-thought-item',
  templateUrl: './thought-item.component.html',
  styleUrls: ['./thought-item.component.scss']
})
export class ThoughtItemComponent {
  @Input() thought: Record;
  @Input() thoughtNext: Record;
}
