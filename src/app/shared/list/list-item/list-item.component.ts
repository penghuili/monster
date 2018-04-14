import { Component, Input } from '@angular/core';

@Component({
  selector: 'mst-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent {
  @Input() showBorderBottom = false;
  @Input() color: string;
}
