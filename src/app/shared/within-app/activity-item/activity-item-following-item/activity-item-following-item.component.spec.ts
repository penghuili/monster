import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityItemFollowingItemComponent } from './activity-item-following-item.component';

describe('ActivityItemFollowingItemComponent', () => {
  let component: ActivityItemFollowingItemComponent;
  let fixture: ComponentFixture<ActivityItemFollowingItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityItemFollowingItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityItemFollowingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
