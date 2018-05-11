import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[mstFontWeight]'
})
export class FontWeightDirective implements OnChanges {
  @Input() mstFontWeight = 400;

  constructor(private elementRef: ElementRef) {
  }

  ngOnChanges() {
    this.elementRef.nativeElement.style.fontWeight = this.mstFontWeight;
  }
}
