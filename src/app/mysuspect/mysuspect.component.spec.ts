import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysuspectComponent } from './mysuspect.component';

describe('MysuspectComponent', () => {
  let component: MysuspectComponent;
  let fixture: ComponentFixture<MysuspectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MysuspectComponent]
    });
    fixture = TestBed.createComponent(MysuspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
