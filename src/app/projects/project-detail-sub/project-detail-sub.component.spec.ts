import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailSubComponent } from './project-detail-sub.component';

describe('ProjectDetailSubComponent', () => {
  let component: ProjectDetailSubComponent;
  let fixture: ComponentFixture<ProjectDetailSubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectDetailSubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
