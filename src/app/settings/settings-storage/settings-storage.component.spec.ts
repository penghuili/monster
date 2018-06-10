import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsStorageComponent } from './settings-storage.component';

describe('SettingsStorageComponent', () => {
  let component: SettingsStorageComponent;
  let fixture: ComponentFixture<SettingsStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
