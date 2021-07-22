import { ComponentFixture, TestBed, async } from "@angular/core/testing";

import { UserResponderComponent } from "./user-responder.component";

describe("UserResponderComponent", () => {
  let component: UserResponderComponent;
  let fixture: ComponentFixture<UserResponderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserResponderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserResponderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
