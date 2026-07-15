import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageSecurityModal } from './manage-security-modal';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { it, expect, describe, beforeEach, vi } from 'vitest';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ManageSecurityModal', () => {
  let component: ManageSecurityModal;
  let fixture: ComponentFixture<ManageSecurityModal>;

  const mockForm = new FormGroup({
    tickerSymbol: new FormControl('AAPL', Validators.required),
    name: new FormControl('Apple Inc.', Validators.required),
    sector: new FormControl('Technology', Validators.required),
    securityType: new FormControl('Stock', Validators.required)
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSecurityModal, ReactiveFormsModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageSecurityModal);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('form', mockForm);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit confirmed event with form value on Add click', () => {
    const spy = vi.spyOn(component.confirmed, 'emit');
    
    const buttons = Array.from(document.body.querySelectorAll('button'));
    const addButton = buttons.find(b => b.textContent?.trim() === 'Add');
    
    expect(addButton).toBeDefined();
    addButton?.click();
    
    expect(spy).toHaveBeenCalledWith(mockForm.value);
  });

  it('should emit cancelled event on Cancel click', () => {
    const spy = vi.spyOn(component.cancelled, 'emit');
    
    const buttons = Array.from(document.body.querySelectorAll('button'));
    const cancelButton = buttons.find(b => b.textContent?.trim() === 'Cancel');
    
    expect(cancelButton).toBeDefined();
    cancelButton?.click();
    
    expect(spy).toHaveBeenCalled();
  });
});