import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[mstSize]'
})
export class SizeDirective implements OnChanges {
  @Input() mstSize: string;

  constructor(private elementRef: ElementRef) { }

  ngOnChanges() {
    if (this.mstSize) {
      const arr = this.mstSize.split(' ');
      const width = arr[0] || 'auto';
      const height = arr[1] || 'auto';
      this.elementRef.nativeElement.style.width = width;
      this.elementRef.nativeElement.style.height = height;
    }
  }
}
