import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowingCreateComponent } from './following-create.component';

describe('FollowingCreateComponent', () => {
  let component: FollowingCreateComponent;
  let fixture: ComponentFixture<FollowingCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowingCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
