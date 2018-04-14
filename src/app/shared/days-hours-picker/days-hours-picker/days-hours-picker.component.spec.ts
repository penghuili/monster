import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaysHoursPickerComponent } from './days-hours-picker.component';

describe('DaysHoursPickerComponent', () => {
  let component: DaysHoursPickerComponent;
  let fixture: ComponentFixture<DaysHoursPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaysHoursPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaysHoursPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
