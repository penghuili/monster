import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'monster-copy-text',
  templateUrl: './copy-text.component.html',
  styleUrls: ['./copy-text.component.scss']
})
export class CopyTextComponent {
  @Input() text: string;
  @Output() success = new EventEmitter<boolean>();
  @ViewChild('textArea') textArea: ElementRef;

  copy() {
    const el = this.textArea.nativeElement;
    el.value = this.text;
    el.select();
    const isSuccess = document.execCommand('Copy');
    this.success.emit(isSuccess);
  }

}
