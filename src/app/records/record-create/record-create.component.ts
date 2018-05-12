import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RecordService } from '@app/core';
import { createRecord, now } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'mst-record-create',
  templateUrl: './record-create.component.html',
  styleUrls: ['./record-create.component.scss']
})
export class RecordCreateComponent extends Unsub implements OnInit {
  @Output() created = new EventEmitter<boolean>();
  recordControl = new InputControl('');
  date = now();
  isShow = false;
  hasError = false;

  constructor(private recordService: RecordService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.recordControl.value$.pipe(debounceTime(1000)).subscribe(() => {
        this.date = now();
      })
    );
  }

  onOpen() {
    this.isShow = true;
  }
  onCreate() {
    const title = this.recordControl.getValue();
    if (title) {
      this.hasError = false;
      const record = createRecord({ title });
      this.addSubscription(
        this.recordService.add(record).subscribe(success => {
          this.isShow = false;
          this.created.emit(true);
          this.reset();
        })
      );
    } else {
      this.hasError = true;
    }
  }
  onCancel() {
    this.isShow = false;
    this.reset();
  }

  private reset() {
    this.recordControl.setValue('');
    this.hasError = false;
  }

}
