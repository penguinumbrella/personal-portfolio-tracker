import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayout } from './main-layout';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { it, expect, describe, beforeEach } from 'vitest';
import { AuthService } from '../../services/AuthService';
import { MessageService } from 'primeng/api';
import { signal } from '@angular/core';

describe('MainLayout', () => {
  let component: MainLayout;
  let fixture: ComponentFixture<MainLayout>;

  // Provide a mock for AuthService since it's used by UserHandle
  const mockAuthService = {
    currentUser: signal({ username: 'testuser' }),
    getCurrentUser: () => ({ subscribe: () => {} })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayout, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        MessageService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidenav on menu button click', async () => {
    const sidenav = fixture.nativeElement.querySelector('mat-sidenav');
    const toggleButton = fixture.nativeElement.querySelector('button[aria-label="Toggle sidebar"]');
    
    // Initial state: opened="true"
    expect(sidenav.classList).toContain('mat-drawer-opened');

    toggleButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    // After toggle: should be closed
    expect(sidenav.classList).not.toContain('mat-drawer-opened');
  });

  it('should contain the menu and user handle components', () => {
    const menu = fixture.nativeElement.querySelector('app-menu');
    const userHandle = fixture.nativeElement.querySelector('app-user-handle');
    
    expect(menu).toBeTruthy();
    expect(userHandle).toBeTruthy();
  });
});