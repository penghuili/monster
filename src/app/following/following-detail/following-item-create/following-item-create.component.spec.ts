import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowingItemCreateComponent } from './following-item-create.component';

describe('FollowingItemCreateComponent', () => {
  let component: FollowingItemCreateComponent;
  let fixture: ComponentFixture<FollowingItemCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowingItemCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowingItemCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
