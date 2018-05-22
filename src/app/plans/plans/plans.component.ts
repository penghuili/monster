import { Component, OnInit } from '@angular/core';
import { ROUTES } from '@app/static';

@Component({
  selector: 'mst-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  ROUTES = ROUTES;

  constructor() { }

  ngOnInit() {
  }

}
