import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'monster-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class WrapperComponent {
  @Input() display = 'flex';
  @Input() direction = 'row';
  @Input() mainAxis = 'start';
  @Input() 'mainAxis.xs' = this.mainAxis;
  @Input() crossAxis = 'start';

  @Input() width = 'auto';
  @Input() height = 'auto';
  @Input() padding = '0';
  @Input() margin = '0';

  @Input() borderTop: boolean;
  @Input() borderBottom: boolean;
  @Input() borderLeft: boolean;
  @Input() borderRight: boolean;
  @Input() borderX: boolean;
  @Input() borderY: boolean;
  @Input() borderAll: boolean;

  @Input() borderColor = 'grey';

  @Input() theme: string;
  @Input() color: string;
  @Input() cursor = 'default';
  @Input() isCircle = false;

  @Input() styles: any;
}
