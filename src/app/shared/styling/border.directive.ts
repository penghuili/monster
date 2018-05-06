import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { Color, COLORS } from '@app/model';

@Directive({
  selector: '[mstBorder]'
})
export class BorderDirective implements OnChanges {
  /**
   * border color
   */
  @Input() mstBorder: Color = Color.LightGrey;

  constructor(private elementRef: ElementRef) {}

  ngOnChanges() {
    this.setColor();
  }

  private setColor() {
    if (this.mstBorder === undefined) {
      return;
    }
    let color: string;
    switch (this.mstBorder) {
      case Color.Accent:
        color = COLORS.ACCENT;
        break;
      case Color.Error:
        color = COLORS.ERROR;
        break;

      default:
        color = COLORS.GREY_LIGHT;
      }
    this.elementRef.nativeElement.style.border = `1px solid ${color}`;
  }
}
