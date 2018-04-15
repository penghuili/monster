import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[mstCursor]'
})
export class CursorDirective implements OnChanges {
  @Input() mstCursor: string;

  constructor(private elementRef: ElementRef) {
  }

  ngOnChanges() {
    this.elementRef.nativeElement.style.cursor = this.mstCursor || 'pointer';
  }

}
