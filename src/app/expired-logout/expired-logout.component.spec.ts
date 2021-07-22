import { ComponentFixture, TestBed, async } from "@angular/core/testing";

import { ExpiredLogoutComponent } from "./expired-logout.component";

describe("ExpiredLogoutComponent", () => {
  let component: ExpiredLogoutComponent;
  let fixture: ComponentFixture<ExpiredLogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpiredLogoutComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
