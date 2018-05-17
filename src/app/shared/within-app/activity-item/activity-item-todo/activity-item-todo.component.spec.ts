import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityItemTodoComponent } from './activity-item-todo.component';

describe('ActivityItemTodoComponent', () => {
  let component: ActivityItemTodoComponent;
  let fixture: ComponentFixture<ActivityItemTodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityItemTodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityItemTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
