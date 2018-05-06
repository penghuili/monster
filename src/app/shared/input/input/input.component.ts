import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Color } from '@app/model';
import { Unsub } from '@app/static';

import { InputControl } from '../input-control';

@Component({
  selector: 'mst-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent extends Unsub implements OnInit {
  @Input() control: InputControl;
  @Input() autoFocus = false;
  @Input() minHeight = '1.5rem';
  @Input() padding: string;
  @Input() hasError = false;
  @Output() enter = new EventEmitter<boolean>();

  @ViewChild('input') private inputEl: ElementRef;

  Color = Color;

  ngOnInit() {
    if (this.autoFocus) {
      this.inputEl.nativeElement.focus();
    }
    this.addSubscription(
      this.control.setValue$.subscribe(value => {
        this.inputEl.nativeElement.innerText = value;
      })
    );
  }

  onKeyup(e: KeyboardEvent) {
    this.control.receiveValue(this.getText());
    if (e.keyCode === 13) {
      this.enter.emit(true);
    }
  }

  private getText(): string {
    return this.inputEl.nativeElement.innerText;
  }
}
