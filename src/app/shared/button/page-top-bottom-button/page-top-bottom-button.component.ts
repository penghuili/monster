import { Component, OnInit } from '@angular/core';
import { FONT_SIZE, Unsub } from '@app/static';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'mst-page-top-bottom-button',
  templateUrl: './page-top-bottom-button.component.html',
  styleUrls: ['./page-top-bottom-button.component.scss']
})
export class PageTopBottomButtonComponent extends Unsub implements OnInit {

  showToBottom = true;

  constructor() {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      fromEvent(window, 'scroll').pipe(debounceTime(300)).subscribe(() => {
        this.showToBottom = window.scrollY + window.innerHeight + FONT_SIZE * 2 < document.body.offsetHeight;
      })
    );
  }

  onToTop() {
    window.scrollTo(0, 0);
  }
  onToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }
}
