import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { createThought, now } from '@app/model';
import { Unsub } from '@app/static';
import { debounceTime } from 'rxjs/operators';

import { ThoughtService } from '../../../core/services/thought.service';
import { InputControl } from '../../input/input-control';

@Component({
  selector: 'mst-thought-create',
  templateUrl: './thought-create.component.html',
  styleUrls: ['./thought-create.component.scss']
})
export class ThoughtCreateComponent extends Unsub implements OnInit {
  @Input() iconColor = 'white';
  @Output() created = new EventEmitter<boolean>();
  thoughtControl = new InputControl({ required: true });
  date = now();
  isShow = false;

  constructor(private thoughtService: ThoughtService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.thoughtControl.value$.pipe(debounceTime(1000)).subscribe(() => {
        this.date = now();
      })
    );
  }

  onOpen() {
    this.isShow = true;
  }
  onCreate() {
    if (this.thoughtControl.valid) {
      const thought = createThought({ title: this.thoughtControl.getValue() });
      this.addSubscription(
        this.thoughtService.add(thought).subscribe(success => {
          this.isShow = false;
          this.created.emit(true);
          this.reset();
        })
      );
    }
  }
  onCancel() {
    this.isShow = false;
    this.reset();
  }

  private reset() {
    this.thoughtControl.reset();
  }
}
