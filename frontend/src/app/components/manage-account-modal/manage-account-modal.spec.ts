import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageAccountModal } from './manage-account-modal';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { it, expect, describe, beforeEach, vi } from 'vitest';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ManageAccountModal', () => {
  let component: ManageAccountModal;
  let fixture: ComponentFixture<ManageAccountModal>;

  // Mock form
  const mockForm = new FormGroup({
    nickname: new FormControl('Test Account', Validators.required),
    accountType: new FormControl('Savings', Validators.required),
    institutionName: new FormControl('Test Bank', Validators.required)
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageAccountModal, ReactiveFormsModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageAccountModal);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('form', mockForm);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('should emit confirmed event with form value on Update click', () => {
      const spy = vi.spyOn(component.confirmed, 'emit');
      
      // Find all buttons, then find the one containing the text "Add" or "Update"
      const buttons = Array.from(document.body.querySelectorAll('button'));
      const updateButton = buttons.find(b => b.textContent?.includes('Add') || b.textContent?.includes('Update')) as HTMLElement;
      
      expect(updateButton).toBeDefined();
      updateButton.click();
      
      expect(spy).toHaveBeenCalledWith(mockForm.value);
    });

  it('should emit cancelled event on Cancel click', () => {
    const spy = vi.spyOn(component.cancelled, 'emit');
    
    // Convert NodeList to Array and filter for buttons that actually have the text
    const buttons = Array.from(document.body.querySelectorAll('button'));
    const cancelButton = buttons.find(b => b.textContent?.trim() === 'Cancel');
    
    expect(cancelButton).toBeDefined();
    cancelButton?.click();
    
    expect(spy).toHaveBeenCalled();
  });
});