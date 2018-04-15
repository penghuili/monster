import { Component, EventEmitter, Input, Output } from '@angular/core';
import { filterDefaults, getDragImageOffsetFunction, Item, moveItem, PipeMeta, PipeType } from '@app/model';
import { DndDropEvent } from 'ngx-drag-drop';

@Component({
  selector: 'mst-drag-drop-list',
  templateUrl: './drag-drop-list.component.html',
  styleUrls: ['./drag-drop-list.component.scss']
})
export class DragDropListComponent {
  @Input() defaultValue: Item;
  @Input() list: Item[];
  @Input() showValueFn: (a: Item) => keyof Item;
  @Input() compareFn: (a: Item, b: Item) => boolean;
  @Input() pipe: PipeMeta = { type: PipeType.None, params: '' };
  @Output() reorder = new EventEmitter<Item[]>();
  @Output() selected = new EventEmitter<Item>();

  showList = false;
  PipeType = PipeType;
  dragImageOffsetFunction = getDragImageOffsetFunction();
  draggingIndex: number;

  onOpen() {
    this.showList = true;
  }
  onDragStart(index: number) {
    this.draggingIndex = index;
  }
  onDrop(dropIndex: number) {
    if (dropIndex !== this.draggingIndex) {
      const list = filterDefaults(moveItem(this.draggingIndex, dropIndex, this.list));
      this.reorder.emit(list);
    }
    this.draggingIndex = undefined;
  }
  onSelect(item: Item) {
    this.selected.emit(item);
    this.showList = false;
  }
}
