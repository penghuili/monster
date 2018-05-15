import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTimelineItemComponent } from './project-timeline-item.component';

describe('ProjectTimelineItemComponent', () => {
  let component: ProjectTimelineItemComponent;
  let fixture: ComponentFixture<ProjectTimelineItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectTimelineItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTimelineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
