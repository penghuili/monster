import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerMonthRowComponent } from './datepicker-month-row.component';

describe('DatepickerMonthRowComponent', () => {
  let component: DatepickerMonthRowComponent;
  let fixture: ComponentFixture<DatepickerMonthRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatepickerMonthRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerMonthRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
