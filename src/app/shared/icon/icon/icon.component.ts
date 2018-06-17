import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'mst-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  @Input() name: string;
  @Input() color: string;
  @Input() size: string;
}
