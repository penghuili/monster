import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ThoughtService } from '@app/core';
import { Thought, TimeRangeType } from '@app/model';
import { Unsub } from '@app/static';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'mst-thoughts',
  templateUrl: './thoughts.component.html',
  styleUrls: ['./thoughts.component.scss']
})
export class ThoughtsComponent extends Unsub implements OnInit, OnChanges {
  @Input() date: number;
  @Input() mode: TimeRangeType;
  thoughts: Thought[];

  private shouldLoad = new BehaviorSubject<boolean>(false);

  constructor(private thoughtService: ThoughtService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.shouldLoad.asObservable().pipe(
        filter(a => a),
        switchMap(() => this.thoughtService.getRecords(this.date, this.mode))
      ).subscribe(thoughts => {
        this.thoughts = thoughts || [];
      })
    );
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['date'] || changes['mode']) {
      if (this.date && this.mode !== undefined) {
        this.shouldLoad.next(true);
      }
    }
  }
}
