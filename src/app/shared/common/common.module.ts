import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconModule } from '../icon/icon.module';
import { InputModule } from '../input/input.module';
import { StructureModule } from '../structure/structure.module';
import { CopyTextComponent } from './copy-text/copy-text.component';
import { ListItemComponent } from './list-item/list-item.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { TagListComponent } from './tag-list/tag-list.component';

@NgModule({
  imports: [
    CommonModule,
    IconModule,
    InputModule,
    StructureModule
  ],
  declarations: [
    ProjectListComponent,
    CopyTextComponent,
    TagListComponent,
    ListItemComponent
  ],
  exports: [
    ProjectListComponent,
    CopyTextComponent,
    TagListComponent,
    ListItemComponent
  ]
})
export class MonsterCommonModule { }
