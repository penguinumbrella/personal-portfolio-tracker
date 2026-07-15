import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageHoldingModal } from './manage-holding-modal';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { it, expect, describe, beforeEach, vi } from 'vitest';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ManageHoldingModal', () => {
  let component: ManageHoldingModal;
  let fixture: ComponentFixture<ManageHoldingModal>;

const mockForm = new FormGroup({
  // Provide a non-null value here
  security: new FormControl({ id: 1, name: 'Apple' }, Validators.required), 
  shares: new FormControl(10, Validators.required),
  costPerShare: new FormControl(100, Validators.required),
  purchaseDate: new FormControl('2026-01-01', Validators.required)
});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageHoldingModal, ReactiveFormsModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageHoldingModal);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('form', mockForm);
    fixture.componentRef.setInput('viewMode', 'byAccount');
    fixture.componentRef.setInput('recordName', 'Test Record');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

it('should emit confirmed event when Update button is clicked', () => {
  mockForm.markAllAsTouched();
  mockForm.updateValueAndValidity();
  
  // DIAGNOSTIC: Check form state
  console.log('Form valid:', mockForm.valid);
  console.log('Form errors:', mockForm.errors);
  console.log('Control errors:', {
    shares: mockForm.get('shares')?.errors,
    costPerShare: mockForm.get('costPerShare')?.errors,
    purchaseDate: mockForm.get('purchaseDate')?.errors,
    security: mockForm.get('security')?.errors
  });

  const spy = vi.spyOn(component.confirmed, 'emit');
  
  const buttons = Array.from(document.body.querySelectorAll('button'));
  const updateButton = buttons.find(b => b.textContent?.trim() === 'Add');
  
  // DIAGNOSTIC: Ensure button exists
  console.log('Update button found:', !!updateButton);
  
  updateButton?.click();
  fixture.detectChanges();
  
  expect(spy).toHaveBeenCalled();
});

  it('should emit cancelled event when Cancel button is clicked', () => {
    const spy = vi.spyOn(component.cancelled, 'emit');
    
    const buttons = Array.from(document.body.querySelectorAll('button'));
    const cancelButton = buttons.find(b => b.textContent?.trim() === 'Cancel');
    
    expect(cancelButton).toBeDefined();
    cancelButton?.click();
    
    expect(spy).toHaveBeenCalled();
  });
});