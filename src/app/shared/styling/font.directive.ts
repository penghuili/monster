import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[mstFont]'
})
export class FontDirective implements OnChanges {
  @Input() mstFont: string;

  constructor(private elementRef: ElementRef) {
  }

  ngOnChanges() {
    this.elementRef.nativeElement.style.fontSize = this.mstFont;
  }

}
