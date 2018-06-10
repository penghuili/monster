import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserNotSupportComponent } from './browser-not-support.component';

describe('BrowserNotSupportComponent', () => {
  let component: BrowserNotSupportComponent;
  let fixture: ComponentFixture<BrowserNotSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowserNotSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowserNotSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
