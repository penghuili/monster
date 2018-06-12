import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { COLORS, isValidColor } from '@app/model';

@Directive({
  selector: '[mstBorder]'
})
export class BorderDirective implements OnChanges {
  /**
   * border color
   */
  @Input() mstBorder: string = COLORS.GREY_LIGHT;

  constructor(private elementRef: ElementRef) {}

  ngOnChanges() {
    this.setColor();
  }

  private setColor() {
    if (isValidColor(this.mstBorder)) {
      let color: string;
      switch (this.mstBorder) {
        case 'accent':
          color = COLORS.ACCENT;
          break;
        case 'error':
          color = COLORS.ERROR;
          break;

        default:
          color = COLORS.GREY_LIGHT;
        }
      this.elementRef.nativeElement.style.border = `1px solid ${color}`;
    }
  }
}
