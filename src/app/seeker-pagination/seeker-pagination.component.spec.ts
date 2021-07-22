import { ComponentFixture, TestBed, async } from "@angular/core/testing";

import { SeekerPaginationComponent } from "./seeker-pagination.component";

describe("SeekerPaginationComponent", () => {
  let component: SeekerPaginationComponent;
  let fixture: ComponentFixture<SeekerPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeekerPaginationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekerPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
