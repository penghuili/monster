import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TagService } from '@app/core';
import { TagCategory } from '@app/model';
import { Unsub } from '@app/static';

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
}
