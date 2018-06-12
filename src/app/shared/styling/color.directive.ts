/* tslint:disable:no-input-rename */
import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { COLORS, isValidColor } from '@app/model';

@Directive({
  selector: '[mstColor]'
})
export class ColorDirective implements OnChanges {
  @Input() mstColor: string;
  @Input('mstColor.bg') mstColorBg = 'white';

  constructor(private elementRef: ElementRef) {}

  ngOnChanges() {
    if (isValidColor(this.mstColor)) {
      this.setColor();
    }
    if (isValidColor(this.mstColorBg)) {
      this.setBgColor();
    }
  }

  private setColor() {
    if (this.mstColor === undefined) {
      return;
    }
    let color: string;
    switch (this.mstColor) {
      case 'accent':
       color = COLORS.ACCENT;
       break;
      case 'grey':
       color = COLORS.GREY;
       break;
      case 'white':
       color = COLORS.WHITE;
       break;
      case 'green':
       color = COLORS.GREEN;
       break;
      case 'purple':
        color = COLORS.PURPLE;
        break;
      case 'yellow':
        color = COLORS.YELLOW;
        break;
      case 'error':
       color = COLORS.ERROR;
       break;

      default:
        color = COLORS.PRIMARY;
      }
      this.elementRef.nativeElement.style.color = color;
  }
  private setBgColor() {
    if (this.mstColorBg === undefined) {
      return;
    }
    let color: string;
    switch (this.mstColorBg) {
      case 'primary':
        color = COLORS.PRIMARY;
        break;
      case 'accent':
        color = COLORS.ACCENT;
        break;
      case 'green':
        color = COLORS.GREEN;
        break;
      case 'purple':
        color = COLORS.PURPLE;
        break;
      case 'yellow':
        color = COLORS.YELLOW;
        break;
      case 'grey':
        color = COLORS.GREY;
        break;
      case 'error':
        color = COLORS.ERROR;
        break;

      default:
        color = COLORS.WHITE;
      }
      this.elementRef.nativeElement.style.backgroundColor = color;
  }
}
