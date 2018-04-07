import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeStorageComponent } from './merge-storage.component';

describe('MergeStorageComponent', () => {
  let component: MergeStorageComponent;
  let fixture: ComponentFixture<MergeStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergeStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
