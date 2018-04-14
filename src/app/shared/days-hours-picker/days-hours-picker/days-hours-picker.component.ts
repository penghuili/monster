import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mst-days-hours-picker',
  templateUrl: './days-hours-picker.component.html',
  styleUrls: ['./days-hours-picker.component.scss']
})
export class DaysHoursPickerComponent implements OnInit {
  days: number;
  hours: number;
  constructor() { }

  ngOnInit() {
  }

}
