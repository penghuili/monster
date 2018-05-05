import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[mstNoSelect]'
})
export class NoSelectDirective {
  constructor(private elementRef: ElementRef) {
    this.elementRef.nativeElement.style.userSelect = 'none';
  }
}
