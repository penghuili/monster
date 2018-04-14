import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DndModule } from 'ngx-drag-drop';

import { IconModule } from '../icon/icon.module';
import { InputModule } from '../input/input.module';
import { StructureModule } from '../structure/structure.module';
import { ListItemComponent } from './list-item/list-item.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { TagListComponent } from './tag-list/tag-list.component';

@NgModule({
  imports: [
    CommonModule,
    IconModule,
    InputModule,
    StructureModule,
    DndModule
  ],
  declarations: [
    ProjectListComponent,
    TagListComponent,
    ListItemComponent
  ],
  exports: [
    ProjectListComponent,
    TagListComponent,
    ListItemComponent
  ]
})
export class ListModule { }
