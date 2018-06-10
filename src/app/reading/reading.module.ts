import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  ButtonModule,
  DatepickerModule,
  IconModule,
  InputModule,
  MonsterCommonModule,
  OverlayModule,
  PipesModule,
  StylingModule,
} from '@app/shared';

import { BookCreateComponent } from './book-create/book-create.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BooksComponent } from './books/books.component';

@NgModule({
  imports: [
    CommonModule,

    ButtonModule,
    OverlayModule,
    InputModule,
    FlexLayoutModule,
    StylingModule,
    DatepickerModule,
    IconModule,
    MonsterCommonModule,
    PipesModule
  ],
  declarations: [BookCreateComponent, BookDetailComponent, BooksComponent],
  exports: [
    BookDetailComponent, BooksComponent
  ]
})
export class ReadingModule { }
