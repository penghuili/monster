import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoStatusPickerComponent } from './todo-status-picker.component';

describe('TodoStatusPickerComponent', () => {
  let component: TodoStatusPickerComponent;
  let fixture: ComponentFixture<TodoStatusPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoStatusPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoStatusPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
