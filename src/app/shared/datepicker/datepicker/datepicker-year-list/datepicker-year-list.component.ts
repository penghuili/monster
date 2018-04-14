import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { now } from '@app/model';

@Component({
  selector: 'mst-datepicker-year-list',
  templateUrl: './datepicker-year-list.component.html',
  styleUrls: ['./datepicker-year-list.component.scss']
})
export class DatepickerYearListComponent implements OnInit {
  @Input() set activeDate(value: number) {
    const date = value !== undefined ? new Date(value) : new Date();
    this.activeYear = date.getFullYear();
  }
  @Output() selectYear = new EventEmitter<number>();

  years: number[];
  activeYear: number;

  ngOnInit() {
    const thisYear = new Date().getFullYear();
    this.years = [ thisYear - 1, thisYear, thisYear + 1, thisYear + 2 ];
  }

  onSelect(y: number) {
    this.selectYear.emit(y);
  }
}
