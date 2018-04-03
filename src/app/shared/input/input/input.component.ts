import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'monster-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements AfterViewInit {
  @Input() control: BehaviorSubject<string>;
  @Input() value: string;
  @Input() minHeight = '1.5rem';
  @Input() autoFocus = false;
  @Input() padding: string;
  @Input() hasError = false;
  @Output() enter = new EventEmitter<boolean>();

  @ViewChild('input') private inputEl: ElementRef;

  ngAfterViewInit() {
    if (this.autoFocus) {
      this.inputEl.nativeElement.focus();
    }
    if (this.value !== undefined) {
      this.inputEl.nativeElement.innerText = this.value;
      this.control.next(this.value);
    }
  }

  onKeyup(e: KeyboardEvent) {
    this.control.next(this.getText());
    if (e.keyCode === 13) {
      this.enter.emit(true);
    }
  }

  private getText(): string {
    return this.inputEl.nativeElement.innerText;
  }
}
