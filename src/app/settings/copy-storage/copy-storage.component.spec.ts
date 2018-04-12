import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyStorageComponent } from './copy-storage.component';

describe('CopyStorageComponent', () => {
  let component: CopyStorageComponent;
  let fixture: ComponentFixture<CopyStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
