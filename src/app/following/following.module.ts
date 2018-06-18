import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowingsComponent } from './followings/followings.component';
import { FollowingCreateComponent } from './following-create/following-create.component';
import { FollowingDetailComponent } from './following-detail/following-detail.component';
import { FollowingItemCreateComponent } from './following-item-create/following-item-create.component';
import { FollowingItemDetailComponent } from './following-item-detail/following-item-detail.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FollowingsComponent, FollowingCreateComponent, FollowingDetailComponent, FollowingItemCreateComponent, FollowingItemDetailComponent]
})
export class FollowingModule { }
