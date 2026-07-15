import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginForm } from './login-form';
import { AuthService } from '../../../services/AuthService';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { it, expect, describe, beforeEach, vi } from 'vitest';

describe('LoginForm', () => {
  let component: LoginForm;
  let fixture: ComponentFixture<LoginForm>;
  let authServiceSpy: any;

  beforeEach(async () => {
    authServiceSpy = {
      login: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginForm, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when fields are empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('should enable login button when form is valid', async () => {
    component.form.setValue({ username: 'user', password: 'password' });
    fixture.detectChanges();
    
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(false);
  });

  it('should call authService.login on form submission', () => {
    authServiceSpy.login.mockReturnValue(of({}));
    component.form.setValue({ username: 'user', password: 'password' });
    fixture.detectChanges();
    
    component.login();
    
    expect(authServiceSpy.login).toHaveBeenCalledWith('user', 'password');
    expect(component.submitting()).toBe(false);
  });

  it('should display error message on failed login', () => {
    authServiceSpy.login.mockReturnValue(throwError(() => new Error('Failed')));
    component.form.setValue({ username: 'user', password: 'password' });
    
    component.login();
    
    expect(component.errorMessage()).toBe('Invalid username or password.');
    expect(component.submitting()).toBe(false);
  });
});