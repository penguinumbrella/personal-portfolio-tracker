import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityDetail } from './security-detail';

describe('SecurityDetail', () => {
  let component: SecurityDetail;
  let fixture: ComponentFixture<SecurityDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
