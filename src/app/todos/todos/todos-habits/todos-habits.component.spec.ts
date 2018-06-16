import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosHabitsComponent } from './todos-habits.component';

describe('TodosHabitsComponent', () => {
  let component: TodosHabitsComponent;
  let fixture: ComponentFixture<TodosHabitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodosHabitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosHabitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
