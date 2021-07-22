import { JobCardService } from "./job-card.service";
import { TestBed } from "@angular/core/testing";

describe("JobCardService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: JobCardService = TestBed.get(JobCardService);
    expect(service).toBeTruthy();
  });
});
