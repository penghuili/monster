import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getDragImageOffsetFunction, Item } from '@app/model';

@Component({
  selector: 'mst-drag-item',
  templateUrl: './drag-item.component.html',
  styleUrls: ['./drag-item.component.scss']
})
export class DragItemComponent {
  @Input() item: Item;
  @Input() index: number;
  @Output() start = new EventEmitter<number>();

  dragImageOffsetFunction = getDragImageOffsetFunction();
}
