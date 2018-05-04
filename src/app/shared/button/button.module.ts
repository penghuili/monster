import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ActionButtonComponent } from './action-button/action-button.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ActionButtonComponent],
  exports: [
    ActionButtonComponent
  ]
})
export class ButtonModule { }
