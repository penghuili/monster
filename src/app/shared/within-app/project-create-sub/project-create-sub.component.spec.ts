import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCreateSubComponent } from './project-create-sub.component';

describe('ProjectCreateSubComponent', () => {
  let component: ProjectCreateSubComponent;
  let fixture: ComponentFixture<ProjectCreateSubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectCreateSubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCreateSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
