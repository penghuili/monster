import { Component } from '@angular/core';
import { ROUTES } from '@app/static';

@Component({
  selector: 'mst-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  routes = ROUTES;
}
