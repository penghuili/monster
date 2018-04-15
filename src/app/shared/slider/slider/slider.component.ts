import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FONT_SIZE, Unsub } from '@app/static';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'mst-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent extends Unsub implements OnChanges, OnInit {
  @Input() min = 0;
  @Input() max = 100;
  @Input() defaultValue = 0;
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
  ngOnChanges(changes: SimpleChanges) {
    if (changes.defaultValue || changes.min || changes.max) {
      this.setDefaultLeft();
    }
  }

  getLeft() {
    const sum = this.left + this.deltaX;
    if (sum < (- FONT_SIZE / 2)) {
      return - FONT_SIZE / 2;
    } else if (sum > (this.barWidth - FONT_SIZE / 2)) {
      return this.barWidth - FONT_SIZE / 2;
    } else {
      return sum;
    }
  }
  private getValue() {
    return +(((this.getLeft() + FONT_SIZE / 2) / this.barWidth) * (this.max - this.min)).toFixed(1);
  }
  private setDefaultLeft() {
    if (this.barWidth) {
      this.left = Math.round(this.defaultValue / this.max * this.barWidth) - FONT_SIZE / 2;
      this.deltaX = 0;
    }
  }
}
