import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'monster-datepicker-title',
  templateUrl: './datepicker-title.component.html',
  styleUrls: ['./datepicker-title.component.scss']
})
export class DatepickerTitleComponent {
  @Input() date: number;
  @Output() openYear = new EventEmitter<boolean>();
}
