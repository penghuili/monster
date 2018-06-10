import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ButtonModule, IconModule, InputModule, MonsterCommonModule, PipesModule, StylingModule } from '@app/shared';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsStorageComponent } from './settings-storage/settings-storage.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    InputModule,
    IconModule,
    MonsterCommonModule,
    StylingModule,
    FlexLayoutModule,
    PipesModule,
    ButtonModule
  ],
  declarations: [
    SettingsComponent,
    SettingsStorageComponent
  ]
})
export class SettingsModule { }
