import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTodosComponent } from './search-todos.component';

describe('SearchTodosComponent', () => {
  let component: SearchTodosComponent;
  let fixture: ComponentFixture<SearchTodosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchTodosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
