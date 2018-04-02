import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'monster-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements AfterViewInit {
  @Input() minHeight = '1.5rem';
  @Input() autoFocus = false;
  @Input() control: BehaviorSubject<string>;
  @Input() padding: string;
  @Output() enter = new EventEmitter<boolean>();

  @ViewChild('input') private inputEl: ElementRef;

  ngAfterViewInit() {
    if (this.autoFocus) {
      this.inputEl.nativeElement.focus();
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
