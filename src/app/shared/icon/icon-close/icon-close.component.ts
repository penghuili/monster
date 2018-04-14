import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mst-icon-close',
  templateUrl: './icon-close.component.html',
  styleUrls: ['./icon-close.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconCloseComponent {
  @Input() isFilled = true;
}
