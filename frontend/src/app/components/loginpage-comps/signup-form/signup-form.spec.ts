import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupForm } from './signup-form';
import { AuthService } from '../../../services/AuthService';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { it, expect, describe, beforeEach, vi } from 'vitest';

describe('SignupForm', () => {
  let component: SignupForm;
  let fixture: ComponentFixture<SignupForm>;
  let authServiceSpy: any;

  beforeEach(async () => {
    authServiceSpy = {
      register: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [SignupForm, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when fields are missing', () => {
    component.form.setValue({ username: '', email: '', password: '' });
    expect(component.form.invalid).toBe(true);
  });

  it('should enable signup button when form is valid', () => {
    component.form.setValue({ 
      username: 'user', 
      email: 'test@example.com', 
      password: 'password123' 
    });
    fixture.detectChanges();
    
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(false);
  });

  it('should call authService.register on successful submission', () => {
    authServiceSpy.register.mockReturnValue(of({}));
    const spy = vi.spyOn(component.switchToLogin, 'emit');
    
    component.form.setValue({ 
      username: 'user', 
      email: 'test@example.com', 
      password: 'password123' 
    });
    component.signup();
    
    expect(authServiceSpy.register).toHaveBeenCalledWith({
      username: 'user',
      email: 'test@example.com',
      passwordHash: 'password123'
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should display error message on registration failure', () => {
    authServiceSpy.register.mockReturnValue(throwError(() => new Error('Registration failed')));
    
    component.form.setValue({ 
      username: 'user', 
      email: 'test@example.com', 
      password: 'password123' 
    });
    component.signup();
    
    expect(component.errorMessage()).toBe('Failed to create account. Please try again.');
    expect(component.submitting()).toBe(false);
  });
});