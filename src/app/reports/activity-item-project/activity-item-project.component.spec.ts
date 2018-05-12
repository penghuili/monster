import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityItemProjectComponent } from './activity-item-project.component';

describe('ActivityItemProjectComponent', () => {
  let component: ActivityItemProjectComponent;
  let fixture: ComponentFixture<ActivityItemProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityItemProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityItemProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
