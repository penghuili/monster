import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconModule, InputModule, MonsterCommonModule, StructureModule } from '@app/shared';

import { CopyStorageComponent } from './copy-storage/copy-storage.component';
import { MergeStorageComponent } from './merge-storage/merge-storage.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    InputModule,
    IconModule,
    MonsterCommonModule,
    StructureModule
  ],
  declarations: [
    MergeStorageComponent,
    CopyStorageComponent,
    SettingsComponent
  ]
})
export class SettingsModule { }
