import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerMonthComponent } from './datepicker-month.component';

describe('DatepickerMonthComponent', () => {
  let component: DatepickerMonthComponent;
  let fixture: ComponentFixture<DatepickerMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatepickerMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
