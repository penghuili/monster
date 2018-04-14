import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Unsub } from '@app/static';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'monster-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent extends Unsub implements OnInit {
  @Input() min = 0;
  @Input() max = 100;
  @Output() valueChange = new EventEmitter<number>();
  @ViewChild('bar') bar: ElementRef;
  @ViewChild('thumb') thumb: ElementRef;

  left: number;
  deltaX: number;
  private barWidth: number;

  constructor() {
    super();
  }

  ngOnInit() {
    this.barWidth = this.bar.nativeElement.clientWidth;
    this.left = Math.floor(this.barWidth / 2);
    this.deltaX = 0;

    const hammer = new Hammer(this.thumb.nativeElement);
    hammer.on('pan', (e) => {
      this.deltaX = e.deltaX;
    });
    hammer.on('panend', (e) => {
      this.left = this.left + this.deltaX;
      this.deltaX = 0;
      const value = Math.floor((this.left / this.barWidth) * (this.max - this.min));
      this.valueChange.emit(value);
    });
  }
}
