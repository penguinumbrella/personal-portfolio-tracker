import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HoldingService } from './HoldingService';
import { environment } from '../../environments/environments';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('HoldingService', () => {
  let service: HoldingService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.baseApiUrl}/holdings`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HoldingService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(HoldingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch holdings per account', () => {
    const mockHoldings = [{ id: { accountId: 1, securityId: 1 } }];
    service.getAllHoldingsPerAccount(1).subscribe(data => {
      expect(data).toEqual(mockHoldings);
    });

    const req = httpMock.expectOne(`${baseUrl}/a/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHoldings);
  });

  it('should fetch holdings per security', () => {
    const mockHoldings = [{ id: { accountId: 1, securityId: 1 } }];
    service.getAllHoldingsPerSecurity(1).subscribe(data => {
      expect(data).toEqual(mockHoldings);
    });

    const req = httpMock.expectOne(`${baseUrl}/s/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHoldings);
  });

  it('should create a holding', () => {
    const payload = { id: { accountId: 1, securityId: 1 }, shares: 10 } as any;
    service.createHolding(payload).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(payload);
  });

  it('should call deleteHolding with correct composite path', () => {
    const id = { accountId: 1, securityId: 2 };
    service.deleteHolding(id as any).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/a/1/s/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should call updateHolding with correct composite path', () => {
    const id = { accountId: 1, securityId: 2 };
    const payload = { shares: 10 } as any;
    service.updateHolding(id as any, payload).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/a/1/s/2`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(payload);
  });

  it('should call getUserHoldingTotal with correct query params', () => {
    service.getUserHoldingTotal(123).subscribe();

    // Verify params logic (assuming userIdParams adds ?userId=123)
    const req = httpMock.expectOne(req =>
      req.url === `${baseUrl}/total` && req.params.has('userId')
    );
    expect(req.request.method).toBe('GET');
    req.flush(5);
  });

  it('should call totalInvestedCost with correct query params', () => {
    service.totalInvestedCost(123).subscribe((data) => {
      expect(data).toBe(900);
    });

    const req = httpMock.expectOne(
      (req) => req.url === `${baseUrl}/totalInvestedCost` && req.params.get('userId') === '123',
    );
    expect(req.request.method).toBe('GET');
    req.flush(900);
  });

  it('should fetch the portfolio value history for a user', () => {
    const mockHistory = [{ date: '2026-01-01', value: 100 }];
    service.getPortfolioValueHistory(123).subscribe((data) => {
      expect(data).toEqual(mockHistory);
    });

    const req = httpMock.expectOne(
      (req) => req.url === `${baseUrl}/valueHistory` && req.params.get('userId') === '123',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockHistory);
  });
});