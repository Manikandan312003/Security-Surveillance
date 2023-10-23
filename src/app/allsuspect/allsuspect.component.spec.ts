import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllsuspectComponent } from './allsuspect.component';

describe('AllsuspectComponent', () => {
  let component: AllsuspectComponent;
  let fixture: ComponentFixture<AllsuspectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllsuspectComponent]
    });
    fixture = TestBed.createComponent(AllsuspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
