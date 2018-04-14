import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TagService } from '@app/core';
import { dragImageOffsetFunction, filterDefaults, moveItem, TagCategory } from '@app/model';
import { Unsub } from '@app/static';
import { DndDropEvent } from 'ngx-drag-drop';

import { InputControl } from '../../input/input-control';

@Component({
  selector: 'monster-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent extends Unsub implements OnInit {
  @Input() active: TagCategory;
  @Output() selected = new EventEmitter<TagCategory>();

  categories: TagCategory[];
  control = new InputControl('');
  isAdding = false;

  dragImageOffsetFunction = dragImageOffsetFunction();
  private draggingIndex: number;

  constructor(private tagService: TagService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.tagService.getCategories().subscribe(data => {
        this.categories = data;
      })
    );
  }

  onSelect(project: TagCategory) {
    this.selected.emit(project);
  }
  onShowInput(e: MouseEvent) {
    this.isAdding = true;
  }
  onCreate() {
    const data: TagCategory = { title: this.control.getValue().trim() };
    this.tagService.createCategory(data);
    this.isAdding = false;
  }

  onDragStart(index: number) {
    this.draggingIndex = index;
  }
  onDrop(event: DndDropEvent) {
    if (event.index !== undefined && event.data) {
      const to = event.index > this.draggingIndex ? event.index - 1 : event.index;
      if (to !== this.draggingIndex) {
        const categories = filterDefaults(moveItem(this.draggingIndex, to, this.categories));
        this.tagService.updateCategories(categories);
      }
    }
    this.draggingIndex = undefined;
  }
}
