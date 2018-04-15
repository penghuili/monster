import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getDragImageOffsetFunction, Item } from '@app/model';

@Component({
  selector: 'mst-drag-drop-item',
  templateUrl: './drag-drop-item.component.html',
  styleUrls: ['./drag-drop-item.component.scss']
})
export class DragDropItemComponent {
  @Input() item: Item;
  @Input() index: number;
  @Output() start = new EventEmitter<number>();

  dragImageOffsetFunction = getDragImageOffsetFunction();
}
