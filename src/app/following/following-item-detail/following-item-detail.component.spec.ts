import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowingItemDetailComponent } from './following-item-detail.component';

describe('FollowingItemDetailComponent', () => {
  let component: FollowingItemDetailComponent;
  let fixture: ComponentFixture<FollowingItemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowingItemDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowingItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
