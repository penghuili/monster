import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mst-icon-done',
  templateUrl: './icon-done.component.html',
  styleUrls: ['./icon-done.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconDoneComponent {
  @Input() isFilled = true;
}
