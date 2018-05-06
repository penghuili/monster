import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ButtonModule } from '../button/button.module';
import { MonsterCommonModule } from '../common/common.module';
import { DatepickerModule } from '../datepicker/datepicker.module';
import { DurationPickerModule } from '../duration-picker/duration-picker.module';
import { IconModule } from '../icon/icon.module';
import { InputModule } from '../input/input.module';
import { OverlayModule } from '../overlay/overlay.module';
import { StylingModule } from '../styling/styling.module';
import { ProjectListComponent } from './project-list/project-list.component';
import { TodoCreateComponent } from './todo-create/todo-create.component';
import { TodoItemComponent } from './todo-item/todo-item.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    InputModule,
    OverlayModule,
    IconModule,
    FlexLayoutModule,
    StylingModule,
    DatepickerModule,
    DurationPickerModule,
    MonsterCommonModule
  ],
  declarations: [
    TodoCreateComponent,
    ProjectListComponent,
    TodoItemComponent
  ],
  exports: [
    TodoCreateComponent,
    ProjectListComponent,
    TodoItemComponent
  ]
})
export class WithinAppModule { }
