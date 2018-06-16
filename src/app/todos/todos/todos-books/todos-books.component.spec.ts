import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosBooksComponent } from './todos-books.component';

describe('TodosBooksComponent', () => {
  let component: TodosBooksComponent;
  let fixture: ComponentFixture<TodosBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodosBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
