import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ProjectListComponent } from './project-list/project-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ProjectListComponent
  ],
  exports: [
    ProjectListComponent
  ]
})
export class MonsterCommonModule { }
