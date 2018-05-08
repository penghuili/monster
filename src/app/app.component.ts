import { Component, OnInit } from '@angular/core';
import { IconsService } from '@app/core';
import { ROUTES } from '@app/static';

@Component({
  selector: 'mst-root',
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
