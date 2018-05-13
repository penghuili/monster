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
import { ExpectedTimePipe } from './pipes/expected-time.pipe';
import { ProjectStatusPipe } from './pipes/project-status.pipe';
import { TodoStatusPipe } from './pipes/todo-status.pipe';
import { ProjectItemComponent } from './project-item/project-item.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectStatusPickerComponent } from './project-status-picker/project-status-picker.component';
import { TodoCreateComponent } from './todo-create/todo-create.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoStatusPickerComponent } from './todo-status-picker/todo-status-picker.component';

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
    TodoItemComponent,
    ProjectItemComponent,
    TodoStatusPipe,
    TodoStatusPickerComponent,
    ProjectStatusPickerComponent,
    ProjectStatusPipe,
    ExpectedTimePipe
  ],
  exports: [
    TodoStatusPipe,
    ProjectStatusPipe,
    ExpectedTimePipe,

    TodoCreateComponent,
    ProjectListComponent,
    TodoItemComponent,
    ProjectItemComponent,
    TodoStatusPickerComponent,
    ProjectStatusPickerComponent
  ]
})
export class WithinAppModule { }
