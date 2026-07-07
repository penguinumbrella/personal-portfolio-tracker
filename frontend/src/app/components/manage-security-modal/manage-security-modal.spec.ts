import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSecurityModal } from './manage-security-modal';

describe('ManageSecurityModal', () => {
  let component: ManageSecurityModal;
  let fixture: ComponentFixture<ManageSecurityModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSecurityModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageSecurityModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
