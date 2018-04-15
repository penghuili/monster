import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[mstPadding]'
})
export class PaddingDirective implements OnChanges {
  @Input() mstPadding: string;

  constructor(private elementRef: ElementRef) {
  }

  ngOnChanges() {
    this.elementRef.nativeElement.style.padding = this.mstPadding;
  }

}
