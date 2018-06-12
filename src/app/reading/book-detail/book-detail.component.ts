import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReadingService } from '@app/core';
import { Book, BookItem } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { merge } from 'ramda';
import { debounceTime, filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'mst-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent extends Unsub implements OnInit {
  book: Book;
  bookItems: BookItem[];
  noteControl = new InputControl({ required: false });

  constructor(
    private readingService: ReadingService,
    private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.addSubscription(
      this.readingService.getBookById(id).subscribe(book => {
        this.book = book;
        if (book && book.note) {
          this.noteControl.setValue(book.note, {emitEvent: false});
        }
      })
    );

    this.addSubscription(
      this.readingService.getBookItemsByBookId(id).subscribe(items => {
        this.bookItems = items;
      })
    );

    this.addSubscription(
      this.noteControl.value$.pipe(
        debounceTime(300),
        filter(note => !!note),
        switchMap(note => this.readingService.update(merge(this.book, {note})))
      ).subscribe(success => {
      })
    );
  }

}
