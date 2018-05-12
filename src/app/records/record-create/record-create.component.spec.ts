import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordCreateComponent } from './record-create.component';

describe('RecordCreateComponent', () => {
  let component: RecordCreateComponent;
  let fixture: ComponentFixture<RecordCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
