import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspectdetailsComponent } from './suspectdetails.component';

describe('SuspectdetailsComponent', () => {
  let component: SuspectdetailsComponent;
  let fixture: ComponentFixture<SuspectdetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuspectdetailsComponent]
    });
    fixture = TestBed.createComponent(SuspectdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
