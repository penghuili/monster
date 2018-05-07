import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[mstLineHeight]'
})
export class LineHeightDirective implements OnChanges {
  @Input() mstLineHeight: string;

  constructor(private elementRef: ElementRef) {
  }

  ngOnChanges() {
    this.elementRef.nativeElement.style.lineHeight = this.mstLineHeight || 'normal';
  }
}
