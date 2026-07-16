import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { InvestmentAccountService } from './InvestmentAccountService';
import { environment } from '../../environments/environments';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('InvestmentAccountService', () => {
  let service: InvestmentAccountService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.baseApiUrl}/investments`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvestmentAccountService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(InvestmentAccountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all investment accounts without a userId', () => {
    const mockAccounts = [{ id: 1, nickname: 'Brokerage' }];
    service.getAllInvestmentAccounts().subscribe((data) => {
      expect(data).toEqual(mockAccounts);
    });

    const req = httpMock.expectOne((r) => r.url === baseUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('userId')).toBe(false);
    req.flush(mockAccounts);
  });

  it('should fetch all investment accounts scoped to a userId', () => {
    service.getAllInvestmentAccounts(1).subscribe();

    const req = httpMock.expectOne((r) => r.url === baseUrl && r.params.get('userId') === '1');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should fetch a page of investment accounts', () => {
    const mockPage = { content: [], totalElements: 0, totalPages: 0, number: 0, size: 10 };
    service.getAccountsPage(1, 0, 10, 'brok').subscribe((data) => {
      expect(data).toEqual(mockPage);
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === `${baseUrl}/page` &&
        r.params.get('userId') === '1' &&
        r.params.get('page') === '0' &&
        r.params.get('size') === '10' &&
        r.params.get('search') === 'brok',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('should fetch an investment account by id', () => {
    const mockAccount = { id: 1, nickname: 'Brokerage' };
    service.getInvestmentAccountById(1).subscribe((data) => {
      expect(data).toEqual(mockAccount);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAccount);
  });

  it('should create an investment account', () => {
    const payload = { nickname: 'Brokerage' } as any;
    service.createInvestmentAccount(payload).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(payload);
  });

  it('should update an investment account', () => {
    const payload = { nickname: 'Brokerage' } as any;
    service.updateInvestmentAccount(1, payload).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(payload);
  });

  it('should delete an investment account', () => {
    service.deleteInvestmentAccount(1).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should fetch the total cost of an account', () => {
    service.getInvestmentAccountTotalCost(1).subscribe((data) => {
      expect(data).toBe(500);
    });

    const req = httpMock.expectOne(`${baseUrl}/1/total-cost`);
    expect(req.request.method).toBe('GET');
    req.flush(500);
  });

  it('should fetch the total investment account count for a user', () => {
    service.getUserInvestmentAccountTotal(1).subscribe((data) => {
      expect(data).toBe(2);
    });

    const req = httpMock.expectOne((r) => r.url === `${baseUrl}/total` && r.params.get('userId') === '1');
    expect(req.request.method).toBe('GET');
    req.flush(2);
  });

  it('should fetch the recent accounts for a user', () => {
    const mockAccounts = [{ id: 1, nickname: 'Brokerage' }];
    service.getRecentAccounts(1).subscribe((data) => {
      expect(data).toEqual(mockAccounts);
    });

    const req = httpMock.expectOne((r) => r.url === `${baseUrl}/recent` && r.params.get('userId') === '1');
    expect(req.request.method).toBe('GET');
    req.flush(mockAccounts);
  });

  it('should fetch the account type breakdown for a user', () => {
    const mockBreakdown = [{ type: 'BROKERAGE', count: 3 }];
    service.getAccountTypeBreakdown(1).subscribe((data) => {
      expect(data).toEqual(mockBreakdown);
    });

    const req = httpMock.expectOne(
      (r) => r.url === `${baseUrl}/breakdown/type` && r.params.get('userId') === '1',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockBreakdown);
  });
});
