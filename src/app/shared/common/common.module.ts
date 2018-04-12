import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconModule } from '../icon/icon.module';
import { InputModule } from '../input/input.module';
import { StructureModule } from '../structure/structure.module';
import { CopyTextComponent } from './copy-text/copy-text.component';
import { ProjectListComponent } from './project-list/project-list.component';

@NgModule({
  imports: [
    CommonModule,
    IconModule,
    InputModule,
    StructureModule
  ],
  declarations: [
    ProjectListComponent,
    CopyTextComponent
  ],
  exports: [
    ProjectListComponent,
    CopyTextComponent
  ]
})
export class MonsterCommonModule { }
