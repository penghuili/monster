import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FONT_SIZE } from '@app/static';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'mst-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnChanges, OnInit {
  @Input() min = 0;
  @Input() max = 100;
  @Input() defaultValue = 0;
  @Output() valueChange = new EventEmitter<number>();
  @ViewChild('bar') bar: ElementRef;
  @ViewChild('thumb') thumb: ElementRef;

  left: number;
  deltaX: number;
  private barWidth: number;

  ngOnInit() {
    this.barWidth = this.bar.nativeElement.clientWidth;

    this.setDefaultLeft();

    const hammer = new Hammer(this.thumb.nativeElement);
    hammer.on('panmove', (e) => {
      this.deltaX = e.deltaX;
      this.valueChange.emit(this.getValue());
    });
    hammer.on('panend', (e) => {
      this.left = this.getLeft();
      this.deltaX = 0;
    });
  }
  ngOnChanges() {
    this.setDefaultLeft();
  }

  getLeft() {
    const sum = this.left + this.deltaX;
    if (sum < (- FONT_SIZE)) {
      return - FONT_SIZE;
    } else if (sum > (this.barWidth - FONT_SIZE)) {
      return this.barWidth - FONT_SIZE;
    } else {
      return sum;
    }
  }
  getWidth() {
    const left = this.getLeft();
    return left < 0 ? 0 : left;
  }
  private getValue() {
    return +(((this.getLeft() + FONT_SIZE / 2) / this.barWidth) * (this.max - this.min)).toFixed(1) + this.min;
  }
  private setDefaultLeft() {
    if (this.barWidth) {
      this.left = Math.round(this.defaultValue / this.max * this.barWidth) - FONT_SIZE / 2;
      this.deltaX = 0;
    }
  }
}
