import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowingDetailComponent } from './following-detail.component';

describe('FollowingDetailComponent', () => {
  let component: FollowingDetailComponent;
  let fixture: ComponentFixture<FollowingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
