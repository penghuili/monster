/* tslint:disable:no-input-rename */
import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { COLORS, isColorWrong } from '@app/model';

@Directive({
  selector: '[mstColor]'
})
export class ColorDirective implements OnChanges {
  @Input() mstColor: string;
  @Input('mstColor.bg') mstColorBg: string;

  constructor(private elementRef: ElementRef) {}

  ngOnChanges() {
    if (isColorWrong(this.mstColor) || isColorWrong(this.mstColorBg)) {
      throw new Error('color has typo');
    } else {
      this.setColor();
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
