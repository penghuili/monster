import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TagService } from '@app/core';
import { Tag, TagCategory } from '@app/model';
import { ALL, Unsub } from '@app/static';

@Component({
  selector: 'mst-tag-create',
  templateUrl: './tag-create.component.html',
  styleUrls: ['./tag-create.component.scss']
})
export class TagCreateComponent extends Unsub implements OnInit {
  currentCategory: TagCategory = ALL;
  showCategories = false;

  constructor(
    private tagService: TagService,
    private route: ActivatedRoute,
    private router: Router) {
      super();
    }

  ngOnInit() {
    this.addSubscription(
      this.tagService.getCurrentCategory().subscribe(c => {
        this.currentCategory = c;
      })
    );
  }

  onShowCategories() {
    this.showCategories = true;
  }
  onSelectCategory(category: TagCategory) {
    this.currentCategory = category;
    this.showCategories = false;
  }
  onCreate() {
    const category = this.currentCategory;
    const tag: Tag = { categoryId: category.id };
    this.tagService.createTag(tag);
    this.router.navigate([ '../' ], { relativeTo: this.route });
  }
  onCancel() {
    this.router.navigate([ '../' ], { relativeTo: this.route });
  }
}
