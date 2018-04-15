import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DndModule } from 'ngx-drag-drop';

import { IconModule } from '../icon/icon.module';
import { InputModule } from '../input/input.module';
import { StylingModule } from '../styling/styling.module';
import { ListItemComponent } from './list-item/list-item.component';
import { ProjectListPickerComponent } from './project-list-picker/project-list-picker.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { TagListComponent } from './tag-list/tag-list.component';

@NgModule({
  imports: [
    CommonModule,
    IconModule,
    InputModule,
    StylingModule,
    DndModule,
    FlexLayoutModule
  ],
  declarations: [
    ProjectListComponent,
    TagListComponent,
    ListItemComponent,
    ProjectListPickerComponent
  ],
  exports: [
    ProjectListComponent,
    TagListComponent,
    ListItemComponent,
    ProjectListPickerComponent
  ]
})
export class ListModule { }
