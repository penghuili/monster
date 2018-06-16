import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosSearchComponent } from './todos-search.component';

describe('TodosSearchComponent', () => {
  let component: TodosSearchComponent;
  let fixture: ComponentFixture<TodosSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodosSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
