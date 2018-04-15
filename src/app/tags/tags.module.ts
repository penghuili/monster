import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconModule, ListModule, MonsterCommonModule, StylingModule } from '@app/shared';

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
    MonsterCommonModule
  ],
  declarations: [TagsComponent, TagCreateComponent]
})
export class TagsModule { }
