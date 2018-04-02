import { Component, OnInit } from '@angular/core';
import { IconsService } from './core/services/icons.service';

@Component({
  selector: 'monster-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private iconsService: IconsService) {
  }

  ngOnInit() {
    this.iconsService.init();
  }
}
