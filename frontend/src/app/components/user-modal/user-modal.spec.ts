import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserModal } from './user-modal';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { it, expect, describe, beforeEach, vi } from 'vitest';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UserModal', () => {
  let component: UserModal;
  let fixture: ComponentFixture<UserModal>;

  const mockForm = new FormGroup({
    username: new FormControl('testuser', Validators.required),
    password: new FormControl('password123', Validators.required),
    email: new FormControl('test@example.com', [Validators.required, Validators.email])
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserModal, ReactiveFormsModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UserModal);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('form', mockForm);
    fixture.componentRef.setInput('recordName', 'testuser');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit confirmed event when Update button is clicked', () => {
    const spy = vi.spyOn(component.confirmed, 'emit');
    
    const buttons = Array.from(document.body.querySelectorAll('button'));
    const updateButton = buttons.find(b => b.textContent?.trim() === 'Update');
    
    updateButton?.click();
    expect(spy).toHaveBeenCalledWith(mockForm.value);
  });

  it('should emit cancelled event when Cancel button is clicked', () => {
    const spy = vi.spyOn(component.cancelled, 'emit');
    
    const buttons = Array.from(document.body.querySelectorAll('button'));
    const cancelButton = buttons.find(b => b.textContent?.trim() === 'Cancel');
    
    cancelButton?.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit loggedOut event when Log Out button is clicked', () => {
    const spy = vi.spyOn(component.loggedOut, 'emit');
    
    const buttons = Array.from(document.body.querySelectorAll('button'));
    const logoutButton = buttons.find(b => b.textContent?.trim() === 'Log Out');
    
    logoutButton?.click();
    expect(spy).toHaveBeenCalled();
  });
});