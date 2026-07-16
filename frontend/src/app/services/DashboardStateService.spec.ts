import { TestBed } from '@angular/core/testing';
import { DashboardStateService } from './DashboardStateService';
import { describe, it, expect, beforeEach } from 'vitest';

describe('DashboardStateService', () => {
  let service: DashboardStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [DashboardStateService] });
    service = TestBed.inject(DashboardStateService);
  });

  it('starts with empty recent accounts and top securities', () => {
    expect(service.recentAccounts()).toEqual([]);
    expect(service.topSecurities()).toEqual([]);
  });

  it('holds whatever recentAccounts is set to, shared across injections', () => {
    const accounts = [{ id: 1, nickname: 'Brokerage' }] as any;
    service.recentAccounts.set(accounts);

    const sameInstance = TestBed.inject(DashboardStateService);
    expect(sameInstance.recentAccounts()).toEqual(accounts);
  });

  it('holds whatever topSecurities is set to', () => {
    const securities = [{ securityId: 1, name: 'Apple', value: 500 }] as any;
    service.topSecurities.set(securities);

    expect(service.topSecurities()).toEqual(securities);
  });
});
