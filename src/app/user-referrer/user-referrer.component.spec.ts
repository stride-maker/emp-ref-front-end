import { ComponentFixture, TestBed, async } from "@angular/core/testing";

import { UserReferrerComponent } from "./user-referrer.component";

describe("UserReferrerComponent", () => {
  let component: UserReferrerComponent;
  let fixture: ComponentFixture<UserReferrerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserReferrerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReferrerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
