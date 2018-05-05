import { Component, OnInit } from '@angular/core';
import { now } from '@app/model';
import { InputControl } from '@app/shared';
import { addDays } from 'date-fns';

@Component({
  selector: 'mst-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss']
})
export class ProjectCreateComponent implements OnInit {
  titleControl = new InputControl('');
  resultControl = new InputControl('');

  hasError = false;

  startDate = now();
  endDate = addDays(this.startDate, 1).getTime();
  endDateStartDate = addDays(this.startDate, 1).getTime();

  constructor() { }

  ngOnInit() {
  }

  onPickStartDate(date: number) {
    this.startDate = date;
    this.endDateStartDate = addDays(this.startDate, 1).getTime();
    if (this.startDate > this.endDate) {
      this.endDate = addDays(this.startDate, 1).getTime();
    }
  }
  onPickEndDate(date: number) {
    this.endDate = date;
  }
}
