import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TagService } from '@app/core';
import { TagCategory } from '@app/model';
import { Unsub } from '@app/static';

@Component({
  selector: 'mst-tag-category-list',
  templateUrl: './tag-category-list.component.html',
  styleUrls: ['./tag-category-list.component.scss']
})
export class TagCategoryListComponent extends Unsub implements OnInit {
  @Input() active: TagCategory;
  @Output() selected = new EventEmitter<TagCategory>();

  categories: TagCategory[];

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
  onReorder(tags: TagCategory[]) {
    if (tags) {
      this.tagService.updateCategories(tags);
    }
  }
}
