import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosTabComponent } from './todos-tab.component';

describe('TodosTabComponent', () => {
  let component: TodosTabComponent;
  let fixture: ComponentFixture<TodosTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodosTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
