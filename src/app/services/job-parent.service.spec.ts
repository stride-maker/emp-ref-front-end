import { JobParentService } from "./job-parent.service";
import { TestBed } from "@angular/core/testing";

describe("JobParentService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: JobParentService = TestBed.get(JobParentService);
    expect(service).toBeTruthy();
  });
});
