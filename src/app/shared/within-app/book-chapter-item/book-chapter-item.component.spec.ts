import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookChapterItemComponent } from './book-chapter-item.component';

describe('BookChapterItemComponent', () => {
  let component: BookChapterItemComponent;
  let fixture: ComponentFixture<BookChapterItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookChapterItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookChapterItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
