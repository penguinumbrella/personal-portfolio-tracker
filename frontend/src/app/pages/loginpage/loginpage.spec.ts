import { TestBed } from '@angular/core/testing';
import { Loginpage } from './loginpage';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Loginpage Component', () => {
  let component: Loginpage;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Loginpage] // Assuming Loginpage is a standalone component
    });

    fixture = TestBed.createComponent(Loginpage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to loginMode', () => {
    expect(component.loginMode()).toBe(true);
    const loginForm = fixture.debugElement.query(By.css('app-login-form'));
    expect(loginForm).toBeTruthy();
  });

  it('should switch to signup mode when event is emitted', () => {
    const loginForm = fixture.debugElement.query(By.css('app-login-form'));
    
    // Simulate the child component event
    loginForm.triggerEventHandler('switchToSignup', null);
    fixture.detectChanges();

    expect(component.loginMode()).toBe(false);
    const signupForm = fixture.debugElement.query(By.css('app-signup-form'));
    expect(signupForm).toBeTruthy();
  });

  it('should switch back to login mode from signup', () => {
    // Set to signup mode
    component.loginMode.set(false);
    fixture.detectChanges();

    const signupForm = fixture.debugElement.query(By.css('app-signup-form'));
    signupForm.triggerEventHandler('switchToLogin', null);
    fixture.detectChanges();

    expect(component.loginMode()).toBe(true);
    expect(fixture.debugElement.query(By.css('app-login-form'))).toBeTruthy();
  });
});