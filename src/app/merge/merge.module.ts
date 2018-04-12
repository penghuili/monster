import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconModule, InputModule } from '@app/shared';

import { MergeRoutingModule } from './merge-routing.module';
import { MergeStorageComponent } from './merge-storage/merge-storage.component';

@NgModule({
  imports: [
    CommonModule,
    MergeRoutingModule,
    InputModule,
    IconModule
  ],
  declarations: [MergeStorageComponent]
})
export class MergeModule { }
