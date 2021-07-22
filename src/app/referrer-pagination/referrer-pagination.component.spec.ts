import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferrerPaginationComponent } from './referrer-pagination.component';

describe('ReferrerPaginationComponent', () => {
  let component: ReferrerPaginationComponent;
  let fixture: ComponentFixture<ReferrerPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferrerPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferrerPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
