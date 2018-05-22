import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IconModule, InputModule, MonsterCommonModule, StylingModule } from '@app/shared';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    InputModule,
    IconModule,
    MonsterCommonModule,
    StylingModule,
    FlexLayoutModule
  ],
  declarations: [
    SettingsComponent
  ]
})
export class SettingsModule { }
