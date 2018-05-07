import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStatusPickerComponent } from './project-status-picker.component';

describe('ProjectStatusPickerComponent', () => {
  let component: ProjectStatusPickerComponent;
  let fixture: ComponentFixture<ProjectStatusPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectStatusPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectStatusPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
