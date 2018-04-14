import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'monster-cancel-confirm',
  templateUrl: './cancel-confirm.component.html',
  styleUrls: ['./cancel-confirm.component.scss']
})
export class CancelConfirmComponent {
  @Output() confirm = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<boolean>();
}
