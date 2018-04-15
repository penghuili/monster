/* tslint:disable:no-input-rename */
import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { COLORS } from '@app/static';

@Directive({
  selector: '[mstColor]'
})
export class ColorDirective implements OnChanges {
  // 'primary', 'accent', 'grey', 'white'
  @Input() mstColor: string;
  // 'primary', 'accent', 'grey'
  @Input('mstColor.bg') mstColorBg: string;

  private colors = ['primary', 'accent', 'grey', 'white'];

  constructor(private elementRef: ElementRef) {}

  ngOnChanges() {
    if (this.colorsIsWrong()) {
      throw new Error('color has typo');
    } else {
      this.setColor();
      this.setBgColor();
    }
  }

  private colorsIsWrong() {
    return (this.mstColor && !this.colors.find(a => a === this.mstColor)) ||
      (this.mstColorBg && !this.colors.find(a => a === this.mstColorBg));
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
      case 'grey':
        color = COLORS.GREY;
        break;
      default:
        color = COLORS.WHITE;
      }
      this.elementRef.nativeElement.style.backgroundColor = color;
  }
}
