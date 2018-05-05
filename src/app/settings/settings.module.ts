import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconModule, InputModule, MonsterCommonModule, StylingModule } from '@app/shared';

import { ProcessDataComponent } from './process-data/process-data.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    InputModule,
    IconModule,
    MonsterCommonModule,
    StylingModule
  ],
  declarations: [
    SettingsComponent,
    ProcessDataComponent
  ]
})
export class SettingsModule { }
