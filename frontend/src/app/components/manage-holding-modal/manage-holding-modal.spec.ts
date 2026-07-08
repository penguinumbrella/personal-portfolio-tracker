import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHoldingModal } from './manage-holding-modal';

describe('ManageHoldingModal', () => {
  let component: ManageHoldingModal;
  let fixture: ComponentFixture<ManageHoldingModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageHoldingModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageHoldingModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
