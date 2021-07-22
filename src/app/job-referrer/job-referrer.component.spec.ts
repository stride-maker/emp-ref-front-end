import { ComponentFixture, TestBed, async } from "@angular/core/testing";

import { JobReferrerComponent } from "./job-referrer.component";

describe("JobReferrerComponent", () => {
  let component: JobReferrerComponent;
  let fixture: ComponentFixture<JobReferrerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JobReferrerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobReferrerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
