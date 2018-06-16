import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityItemTodoThoughtComponent } from './activity-item-todo-thought.component';

describe('ActivityItemTodoThoughtComponent', () => {
  let component: ActivityItemTodoThoughtComponent;
  let fixture: ComponentFixture<ActivityItemTodoThoughtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityItemTodoThoughtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityItemTodoThoughtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
