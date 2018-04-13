import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'monster-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkComponent {
  @Input() route: string;
}
