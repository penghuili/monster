import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'mst-cancel-confirm',
  templateUrl: './cancel-confirm.component.html',
  styleUrls: ['./cancel-confirm.component.scss']
})
export class CancelConfirmComponent {
  @Output() confirm = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<boolean>();
}
