import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountDetail } from './account-detail';
import { InvestmentAccountService } from '../../services/InvestmentAccountService';
import { SecurityService } from '../../services/SecurityService';
import { AuthService } from '../../services/AuthService';
import { MessageService, ConfirmationService } from 'primeng/api';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { it, expect, describe, beforeEach, vi } from 'vitest';

describe('AccountDetail', () => {
  let component: AccountDetail;
  let fixture: ComponentFixture<AccountDetail>;

  // Mock services
  const mockAuthService = {
    getCurrentUser: () => of({ id: 1 }),
    currentUserId: signal(1)
  };

  const mockAccountService = {
    getAllInvestmentAccounts: () => of([{ id: 1, nickname: 'Brokerage', institutionName: 'Bank' }]),
    getAccountsPage: () => of({
      content: [{ id: 1, nickname: 'Brokerage', institutionName: 'Bank' }],
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 10,
    }),
    getInvestmentAccountById: () => of({ id: 1, nickname: 'Brokerage', institutionName: 'Bank' })
  };

  const mockSecurityService = {
    getAllSecuritiesByUser: () => of([])
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDetail, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: InvestmentAccountService, useValue: mockAccountService },
        { provide: SecurityService, useValue: mockSecurityService },
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([]),
        MessageService,
        ConfirmationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDetail);
    
    // Explicitly set the user ID required by the BaseDetailDirective
    component = fixture.componentInstance;
    component.currentUserId.set(1); 
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load sidebar items on init', async () => {
    component.loadAccounts();
    await fixture.whenStable();
    
    expect(component.sidebarItems().length).toBe(1);
    expect(component.sidebarItems()[0].label).toBe('Brokerage');
  });

  it('should update account details when onAccountSelect is called', async () => {
    component.onAccountSelect({ id: 1, label: 'Brokerage', subtitle: 'Bank' });
    fixture.detectChanges();
    await fixture.whenStable();
    
    expect(component.account()?.id).toBe(1);
    expect(component.accountFields().length).toBeGreaterThan(0);
  });

  it('should open account modal on add', () => {
    component.onOpenAddAccountModal();
    expect(component.isAccountModalVisible()).toBe(true);
    expect(component.editingAccount()).toBeNull();
  });
});