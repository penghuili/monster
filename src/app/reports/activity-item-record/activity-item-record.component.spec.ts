import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityItemRecordComponent } from './activity-item-record.component';

describe('ActivityItemRecordComponent', () => {
  let component: ActivityItemRecordComponent;
  let fixture: ComponentFixture<ActivityItemRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityItemRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityItemRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
