import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoActivitiesComponent } from './todo-activities.component';

describe('TodoActivitiesComponent', () => {
  let component: TodoActivitiesComponent;
  let fixture: ComponentFixture<TodoActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
