import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerYearListComponent } from './datepicker-year-list.component';

describe('DatepickerYearListComponent', () => {
  let component: DatepickerYearListComponent;
  let fixture: ComponentFixture<DatepickerYearListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatepickerYearListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerYearListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
