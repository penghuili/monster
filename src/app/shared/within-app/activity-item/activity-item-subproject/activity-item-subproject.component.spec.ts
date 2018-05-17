import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityItemSubprojectComponent } from './activity-item-subproject.component';

describe('ActivityItemSubprojectComponent', () => {
  let component: ActivityItemSubprojectComponent;
  let fixture: ComponentFixture<ActivityItemSubprojectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityItemSubprojectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityItemSubprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
