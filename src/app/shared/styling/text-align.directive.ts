import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[mstTextAlign]'
})
export class TextAlignDirective implements OnChanges {
  @Input() mstTextAlign: string;

  constructor(private elementRef: ElementRef) { }

  ngOnChanges() {
    if (this.mstTextAlign) {
      this.elementRef.nativeElement.style.textAlign = this.mstTextAlign;
    }
  }
}
