import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowingStatusPickerComponent } from './following-status-picker.component';

describe('FollowingStatusPickerComponent', () => {
  let component: FollowingStatusPickerComponent;
  let fixture: ComponentFixture<FollowingStatusPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowingStatusPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowingStatusPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
