import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FONT_SIZE } from '@app/static';

@Component({
  selector: 'mst-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressComponent implements OnInit, OnChanges {
  // percent
  @Input() progress = 0;
  @Input() starting = false;
  @Input() endLabel: string;
  @ViewChild('bar') bar: ElementRef;

  validWidth: number;
  invalidWidth: number;
  thumbLeft: number;
  endLeft: number;
  private barWidth: number;

  ngOnInit() {
    this.barWidth = this.bar.nativeElement.clientWidth;
    this.getLeft();
  }
  ngOnChanges() {
    this.getLeft();
  }

  private getLeft() {
    if (this.progress <= 1) {
      this.validWidth = this.progress * this.barWidth - FONT_SIZE;
      this.invalidWidth = 0;
      this.thumbLeft = this.validWidth - FONT_SIZE;
      this.thumbLeft = this.thumbLeft < - FONT_SIZE / 2 ? - FONT_SIZE / 2 : this.thumbLeft;
      this.endLeft = this.barWidth - FONT_SIZE * 3;
    } else {
      this.validWidth = 1 / this.progress * this.barWidth - FONT_SIZE;
      this.invalidWidth = this.barWidth - this.validWidth;
      this.thumbLeft = this.barWidth - FONT_SIZE;
      this.endLeft = this.validWidth - FONT_SIZE * 3;
    }
  }
}
