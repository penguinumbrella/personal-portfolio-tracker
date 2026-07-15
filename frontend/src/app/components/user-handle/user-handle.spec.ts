import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserHandle } from './user-handle';
import { AuthService } from '../../services/AuthService';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

describe('UserHandle', () => {
  let component: UserHandle;
  let fixture: ComponentFixture<UserHandle>;
  
  // Mock AuthService
  const mockAuthService = {
    currentUser: signal({ username: 'testuser', email: 'test@test.com' }),
    getCurrentUser: () => of({}),
    updateCurrentUser: () => of({}),
    logout: () => of({})
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHandle, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserHandle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal when openModal is called', () => {
    component.openModal();
    expect(component.isModalVisible()).toBe(true);
  });

  it('should close modal when closeModal is called', () => {
    component.isModalVisible.set(true);
    component.closeModal();
    expect(component.isModalVisible()).toBe(false);
  });

  it('should call authService.logout and navigate on logout', () => {
    const spy = vi.spyOn(mockAuthService, 'logout').mockReturnValue(of({}));
    component.logout();
    expect(spy).toHaveBeenCalled();
    expect(component.isModalVisible()).toBe(false);
  });
});