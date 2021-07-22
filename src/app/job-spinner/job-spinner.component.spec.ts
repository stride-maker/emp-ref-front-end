import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSpinnerComponent } from './job-spinner.component';

describe('JobSpinnerComponent', () => {
  let component: JobSpinnerComponent;
  let fixture: ComponentFixture<JobSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
