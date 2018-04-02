import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { IconsService } from './services/icons.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    IconsService,
    HttpClientModule
  ],
  declarations: []
})
export class CoreModule { }
