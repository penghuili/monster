import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TagService } from '@app/core';
import { filterTags, Tag, TagCategory } from '@app/model';
import { ROUTES, Unsub } from '@app/static';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'mst-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent extends Unsub implements OnInit {
  tags: Tag[];
  tagsLength: number;
  currentCategory: TagCategory;
  showCategories: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tagService: TagService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      combineLatest(
        this.tagService.getTags(),
        this.tagService.getCurrentCategory()
      ).subscribe(([ tags, current ]) => {
        this.currentCategory = current;
        this.tags = filterTags(tags, current);
        this.tagsLength = this.tags.length;
      })
    );
  }

  getCategory(categoryId: string): TagCategory {
    return this.tagService.getCategoryById(categoryId);
  }
  onGotoCreate() {
    this.router.navigate([ ROUTES.CREATE ], { relativeTo: this.route });
  }
  onShowCategories() {
    this.showCategories = true;
  }
  onChangeCategory(category: TagCategory) {
    this.tagService.updateCurrentCategory(category);
    this.showCategories = false;
  }

}
