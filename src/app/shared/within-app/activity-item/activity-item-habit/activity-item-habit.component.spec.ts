import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityItemHabitComponent } from './activity-item-habit.component';

describe('ActivityItemHabitComponent', () => {
  let component: ActivityItemHabitComponent;
  let fixture: ComponentFixture<ActivityItemHabitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityItemHabitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityItemHabitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
