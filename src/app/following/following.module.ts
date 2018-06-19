import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  ButtonModule,
  ChartModule,
  DragDropModule,
  IconModule,
  InputModule,
  MonsterCommonModule,
  OverlayModule,
  PipesModule,
  SliderModule,
  StylingModule,
  WithinAppModule,
} from '@app/shared';

import { FollowingCreateComponent } from './following-create/following-create.component';
import { FollowingDetailComponent } from './following-detail/following-detail.component';
import { FollowingItemCreateComponent } from './following-detail/following-item-create/following-item-create.component';
import { FollowingStatusPickerComponent } from './following-status-picker/following-status-picker.component';
import { FollowingStatusPipe } from './following-status.pipe';
import { FollowingsComponent } from './followings/followings.component';

@NgModule({
  imports: [
    CommonModule,

    ButtonModule,
    OverlayModule,
    InputModule,
    MonsterCommonModule,
    StylingModule,
    FlexLayoutModule,
    DragDropModule,
    PipesModule,
    SliderModule,
    ChartModule,
    WithinAppModule,
    IconModule
  ],
  declarations: [
    FollowingsComponent,
    FollowingCreateComponent,
    FollowingDetailComponent,
    FollowingItemCreateComponent,
    FollowingStatusPickerComponent,
    FollowingStatusPipe
  ],
  exports: [
    FollowingsComponent,
    FollowingDetailComponent
  ]
})
export class FollowingModule { }
