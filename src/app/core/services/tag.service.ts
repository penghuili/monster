import { Injectable } from '@angular/core';
import { createOneTag, createTagCategory, MonsterStorage, Tag, TagCategory } from '@app/model';
import { ALL } from '@app/static';
import { append, concat, prepend } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class TagService {
  private categories$ = new BehaviorSubject<TagCategory[]>([]);
  private currentCategory$ = new BehaviorSubject<TagCategory>(null);
  private tags$ = new BehaviorSubject<Tag[]>([]);

  constructor() {
    const categories = this.addDefault(MonsterStorage.get('tag-categories'));
    this.categories$.next(categories);

    const current = MonsterStorage.get('current-tag-category') || ALL;
    this.currentCategory$.next(current);

    const tags = MonsterStorage.get('tags');
    this.tags$.next(tags);
  }

  // category
  getCategories(): Observable<TagCategory[]> {
    return this.categories$.asObservable().pipe(
      filter(data => !!data)
    );
  }
  getCategoryById(id: string): TagCategory {
    return this.categories$.getValue().find(a => a.id === id);
  }
  getCurrentCategory(): Observable<TagCategory> {
    return this.currentCategory$.asObservable();
  }
  updateCurrentCategory(project: TagCategory) {
    MonsterStorage.set('current-tag-category', project);
    this.currentCategory$.next(project);
  }
  updateCategories(categories: TagCategory[]) {
    const categoriesWithAll = this.addDefault(categories);
    MonsterStorage.set('tag-categories', categories);
    this.categories$.next(categoriesWithAll);
  }
  createCategory(data: TagCategory) {
    const tc = createTagCategory(data);
    const tcs = append(tc, MonsterStorage.get('tag-categories'));
    this.updateCategories(tcs);
  }

  // tags
  getTags(): Observable<Tag[]> {
    return this.tags$.asObservable().pipe(
      filter(data => !!data)
    );
  }
  updateTags(tags: Tag[]) {
    MonsterStorage.set('tags', tags);
    this.tags$.next(tags);
  }
  getTagById(id: string): Observable<Tag> {
    return this.getTags().pipe(
      map(tags => tags.find(a => a.id === id))
    );
  }
  createTag(data: Tag) {
    const tag = createOneTag(data);
    const tags = MonsterStorage.get('tags');
    const added = prepend(tag, tags);
    this.updateTags(added);
  }

  private addDefault(categories: TagCategory[]): TagCategory[] {
    return categories ? concat([ALL], categories) : [ALL];
  }
}
