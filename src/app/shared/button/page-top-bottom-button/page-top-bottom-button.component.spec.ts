import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTopBottomButtonComponent } from './page-top-bottom-button.component';

describe('PageTopBottomButtonComponent', () => {
  let component: PageTopBottomButtonComponent;
  let fixture: ComponentFixture<PageTopBottomButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageTopBottomButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageTopBottomButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
