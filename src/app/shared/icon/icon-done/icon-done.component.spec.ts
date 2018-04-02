import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconDoneComponent } from './icon-done.component';

describe('IconDoneComponent', () => {
  let component: IconDoneComponent;
  let fixture: ComponentFixture<IconDoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconDoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
