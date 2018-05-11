import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStatsComponent } from './report-stats.component';

describe('ReportStatsComponent', () => {
  let component: ReportStatsComponent;
  let fixture: ComponentFixture<ReportStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
