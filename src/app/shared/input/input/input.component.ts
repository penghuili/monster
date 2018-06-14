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
import { Unsub } from '@app/static';
import { filter } from 'rxjs/operators';

import { InputService } from '../../../core/services/input.service';
import { InputControl } from '../input-control';

@Component({
  selector: 'mst-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent extends Unsub implements OnInit, OnChanges {
  @Input() control: InputControl<string>;
  @Input() autoFocus = false;
  @Input() disabled: boolean;
  @Input() width = 'auto';
  @Input() padding = '0.25rem';
  @Input() minHeight = '1.5rem';
  @Output() enter = new EventEmitter<boolean>();

  @ViewChild('input') private inputEl: ElementRef;

  constructor(private inputService: InputService) {
    super();
  }

  ngOnInit() {
    if (this.autoFocus) {
      this.inputEl.nativeElement.focus();
    }
    this.addSubscription(
      this.control.setValue$.subscribe(value => {
        this.inputEl.nativeElement.innerText = value === undefined || value === null ? '' : value;
      })
    );
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['disabled']) {
      if (this.disabled) {
        this.disableEditable();
      } else {
        this.enableEditable();
      }
    }
  }

  onFocus() {
    this.inputService.isFocusing();
  }
  onBlur() {
    this.inputService.isBlurred();
  }
  onKeyup(e: KeyboardEvent) {
    this.control.receiveValue(this.getText());
    if (e.keyCode === 13) {
      this.enter.emit(true);
    }
  }

  // can't [contenteditable]="disabled" in template
  private disableEditable() {
    if (this.inputEl && this.inputEl.nativeElement) {
      (<HTMLDivElement>this.inputEl.nativeElement).setAttribute('contenteditable', 'false');
    }
  }
  private enableEditable() {
    if (this.inputEl && this.inputEl.nativeElement) {
      (<HTMLDivElement>this.inputEl.nativeElement).setAttribute('contenteditable', 'true');
    }
  }
  private getText(): string {
    return this.inputEl.nativeElement.innerText;
  }
}
