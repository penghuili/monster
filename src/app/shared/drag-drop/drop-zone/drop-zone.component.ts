import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';

@Component({
  selector: 'mst-drop-zone',
  templateUrl: './drop-zone.component.html',
  styleUrls: ['./drop-zone.component.scss']
})
export class DropZoneComponent {
  @Input() dragIndex: number;
  @Output() drop = new EventEmitter<number>();

  onDrop(event: DndDropEvent) {
    if (event.index !== undefined && event.data) {
      const to = event.index > this.dragIndex ? event.index - 1 : event.index;
      this.drop.emit(to);
    }
  }
}
