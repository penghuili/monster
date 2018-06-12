import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BookItem } from '@app/model';
import { merge } from 'ramda';

import { ReadingService } from '../../../core/services/reading.service';

@Component({
  selector: 'mst-book-chapter-item',
  templateUrl: './book-chapter-item.component.html',
  styleUrls: ['./book-chapter-item.component.scss']
})
export class BookChapterItemComponent {
  @Input() bookItem: BookItem;

  constructor(private readingService: ReadingService) {}

  onFinish() {
    if (!this.bookItem.finished) {
      const finishedItem = merge(this.bookItem, {finished: true});
      this.readingService.updateBookItem(finishedItem).subscribe(success => {
        if (success) {
          this.bookItem = finishedItem;
        }
      });
    }
  }
}
