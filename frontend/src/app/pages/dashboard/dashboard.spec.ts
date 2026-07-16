import { TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';
import { AuthService } from '../../services/AuthService';
import { InvestmentAccountService } from '../../services/InvestmentAccountService';
import { HoldingService } from '../../services/HoldingService';
import { SecurityService } from '../../services/SecurityService';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Dashboard Component', () => {
  let component: Dashboard;

  const mockAuthService = { getCurrentUser: () => of({ id: 123 }) };
  const mockAccountService = {
    getUserInvestmentAccountTotal: () => of(5),
    getRecentAccounts: () => of([]),
    getInvestmentAccountTotalCost: () => of(0),
    getAccountTypeBreakdown: () => of([]),
    getAllInvestmentAccounts: () => of([]),
  };
  const mockHoldingService = {
    getUserHoldingTotal: () => of(10),
    totalInvestedCost: () => of(1000),
    getAllHoldingsPerAccount: () => of([]),
  };
  const mockSecurityService = {
    getUserSecurityTotal: () => of(3),
    getTopSecurities: () => of([]),
    getSecurityTypeBreakdown: () => of([]),
    getSectorBreakdown: () => of([]),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Dashboard,
        { provide: AuthService, useValue: mockAuthService },
        { provide: InvestmentAccountService, useValue: mockAccountService },
        { provide: HoldingService, useValue: mockHoldingService },
        { provide: SecurityService, useValue: mockSecurityService }
      ]
    });

    component = TestBed.inject(Dashboard);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data on initialization', () => {
    // Spy on the service methods
    const accountSpy = vi.spyOn(mockAccountService, 'getUserInvestmentAccountTotal');
    const holdingSpy = vi.spyOn(mockHoldingService, 'getUserHoldingTotal');

    component.ngOnInit();

    expect(accountSpy).toHaveBeenCalledWith(123);
    expect(holdingSpy).toHaveBeenCalledWith(123);
    expect(component.totalAccounts()).toBe(5);
    expect(component.totalHoldings()).toBe(10);
  });
});