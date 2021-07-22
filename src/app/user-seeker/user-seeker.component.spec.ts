import { ComponentFixture, TestBed, async } from "@angular/core/testing";

import { UserSeekerComponent } from "./user-seeker.component";

describe("UserSeekerComponent", () => {
  let component: UserSeekerComponent;
  let fixture: ComponentFixture<UserSeekerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserSeekerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSeekerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
