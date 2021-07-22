import { ComponentFixture, TestBed, async } from "@angular/core/testing";

import { FailResetPasswordComponent } from "./fail-reset-password.component";

describe("FailResetPasswordComponent", () => {
  let component: FailResetPasswordComponent;
  let fixture: ComponentFixture<FailResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FailResetPasswordComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
