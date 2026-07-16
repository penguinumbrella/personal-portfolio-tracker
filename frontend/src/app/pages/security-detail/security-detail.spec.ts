import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecurityDetail } from './security-detail';
import { SecurityService } from '../../services/SecurityService';
import { InvestmentAccountService } from '../../services/InvestmentAccountService';
import { AuthService } from '../../services/AuthService';
import { HoldingService } from '../../services/HoldingService'; // Ensure this path is correct
import { MessageService, ConfirmationService } from 'primeng/api';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { it, expect, describe, beforeEach, vi } from 'vitest';

describe('SecurityDetail', () => {
  let component: SecurityDetail;
  let fixture: ComponentFixture<SecurityDetail>;

  const mockAuthService = {
    getCurrentUser: () => of({ id: 1 }),
    currentUserId: signal(1)
  };

  const mockSecurityService = {
    getAllSecuritiesByUser: () => of([{ id: 1, name: 'Apple', tickerSymbol: 'AAPL', type: 'Stock' }]),
    getSecuritiesPageForUser: () => of({
      content: [{ id: 1, name: 'Apple', tickerSymbol: 'AAPL', type: 'Stock' }],
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 10,
    }),
    getSecurityById: () => of({ id: 1, name: 'Apple', tickerSymbol: 'AAPL', type: 'Stock', sector: 'Tech' })
  };

  const mockAccountService = {
    getAllInvestmentAccounts: () => of([])
  };

  const mockHoldingService = {
    getAllHoldingsPerSecurity: () => of([]) // Mocking the service to prevent 401s
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityDetail, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: SecurityService, useValue: mockSecurityService },
        { provide: InvestmentAccountService, useValue: mockAccountService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: HoldingService, useValue: mockHoldingService },
        provideRouter([]),
        MessageService,
        ConfirmationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityDetail);
    component = fixture.componentInstance;
    
    // Satisfy base class requirements
    component.currentUserId.set(1);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load sidebar items on init', async () => {
    component.loadSecurities();
    await fixture.whenStable();
    
    expect(component.sidebarItems().length).toBe(1);
    expect(component.sidebarItems()[0].label).toBe('Apple');
  });

  it('should update security details when onSecuritySelect is called', async () => {
    component.onSecuritySelect({ id: 1, label: 'Apple', subtitle: 'Stock' });
    fixture.detectChanges();
    await fixture.whenStable();
    
    expect(component.security()?.tickerSymbol).toBe('AAPL');
    expect(component.securityFields().length).toBeGreaterThan(0);
  });

  it('should open security modal on add', () => {
    component.onOpenAddSecurityModal();
    expect(component.isSecurityModalVisible()).toBe(true);
    expect(component.editingSecurity()).toBeNull();
  });
});