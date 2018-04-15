import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule, IconModule, ListModule, MonsterCommonModule, StylingModule } from '@app/shared';

import { TagCategoryListComponent } from './tag-category-list/tag-category-list.component';
import { TagCreateComponent } from './tag-create/tag-create.component';
import { TagsRoutingModule } from './tags-routing.module';
import { TagsComponent } from './tags/tags.component';

@NgModule({
  imports: [
    CommonModule,
    TagsRoutingModule,
    StylingModule,
    IconModule,
    ListModule,
    MonsterCommonModule,
    FlexLayoutModule,
    DragDropModule
  ],
  declarations: [
    TagsComponent,
    TagCreateComponent,
    TagCategoryListComponent
  ]
})
export class TagsModule { }
