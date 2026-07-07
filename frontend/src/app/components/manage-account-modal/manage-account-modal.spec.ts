import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageModal } from './manage-account-modal';

describe('ManageModal', () => {
  let component: ManageModal;
  let fixture: ComponentFixture<ManageModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
