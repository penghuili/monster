import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import { ButtonModule } from '../button/button.module';
import { MonsterCommonModule } from '../common/common.module';
import { DatepickerModule } from '../datepicker/datepicker.module';
import { DurationPickerModule } from '../duration-picker/duration-picker.module';
import { IconModule } from '../icon/icon.module';
import { InputModule } from '../input/input.module';
import { OverlayModule } from '../overlay/overlay.module';
import { PipesModule } from '../pipes/pipes.module';
import { StylingModule } from '../styling/styling.module';
import { TimelineModule } from '../timeline/timeline.module';
import { ActivityItemHabitComponent } from './activity-item/activity-item-habit/activity-item-habit.component';
import { ActivityItemProjectComponent } from './activity-item/activity-item-project/activity-item-project.component';
import { ActivityItemRecordComponent } from './activity-item/activity-item-record/activity-item-record.component';
import {
  ActivityItemSubprojectComponent,
} from './activity-item/activity-item-subproject/activity-item-subproject.component';
import {
  ActivityItemTodoThoughtComponent,
} from './activity-item/activity-item-todo-thought/activity-item-todo-thought.component';
import { ActivityItemTodoComponent } from './activity-item/activity-item-todo/activity-item-todo.component';
import { ActivityItemComponent } from './activity-item/activity-item.component';
import { BookChapterItemComponent } from './book-chapter-item/book-chapter-item.component';
import { HabitItemComponent } from './habit-item/habit-item.component';
import { ExpectedTimePipe } from './pipes/expected-time.pipe';
import { ProjectStatusPipe } from './pipes/project-status.pipe';
import { TodoStatusPipe } from './pipes/todo-status.pipe';
import { ProjectItemComponent } from './project-item/project-item.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectStatusPickerComponent } from './project-status-picker/project-status-picker.component';
import { ThoughtCreateComponent } from './thought-create/thought-create.component';
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
    MonsterCommonModule,
    RouterModule,
    PipesModule,
    TimelineModule
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
    ExpectedTimePipe,
    ActivityItemProjectComponent,
    ActivityItemSubprojectComponent,
    ActivityItemTodoComponent,
    ActivityItemRecordComponent,
    ActivityItemProjectComponent,
    ActivityItemComponent,
    HabitItemComponent,
    ThoughtCreateComponent,
    BookChapterItemComponent,
    ActivityItemTodoThoughtComponent,
    ActivityItemHabitComponent
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
    ProjectStatusPickerComponent,
    ActivityItemComponent,
    HabitItemComponent,
    ThoughtCreateComponent,
    BookChapterItemComponent,
    ActivityItemHabitComponent
  ]
})
export class WithinAppModule { }
