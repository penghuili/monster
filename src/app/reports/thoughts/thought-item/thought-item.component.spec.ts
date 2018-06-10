import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtItemComponent } from './thought-item.component';

describe('ThoughtItemComponent', () => {
  let component: ThoughtItemComponent;
  let fixture: ComponentFixture<ThoughtItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThoughtItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoughtItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
