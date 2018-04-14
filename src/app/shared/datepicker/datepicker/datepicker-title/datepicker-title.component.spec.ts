import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerTitleComponent } from './datepicker-title.component';

describe('DatepickerTitleComponent', () => {
  let component: DatepickerTitleComponent;
  let fixture: ComponentFixture<DatepickerTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatepickerTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
