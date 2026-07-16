import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SecurityService } from './SecurityService';
import { environment } from '../../environments/environments';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('SecurityService', () => {
  let service: SecurityService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.baseApiUrl}/securities`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecurityService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(SecurityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch a security by id', () => {
    const mockSecurity = { id: 1, tickerSymbol: 'AAPL' };
    service.getSecurityById(1).subscribe((data) => {
      expect(data).toEqual(mockSecurity);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSecurity);
  });

  it('should fetch all securities for a user', () => {
    const mockSecurities = [{ id: 1, tickerSymbol: 'AAPL' }];
    service.getAllSecuritiesByUser(1).subscribe((data) => {
      expect(data).toEqual(mockSecurities);
    });

    const req = httpMock.expectOne(`${baseUrl}/u/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSecurities);
  });

  it('should fetch a page of securities for a user', () => {
    const mockPage = { content: [], totalElements: 0, totalPages: 0, number: 0, size: 10 };
    service.getSecuritiesPageForUser(1, 0, 10, 'app').subscribe((data) => {
      expect(data).toEqual(mockPage);
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === `${baseUrl}/u/1/page` &&
        r.params.get('page') === '0' &&
        r.params.get('size') === '10' &&
        r.params.get('search') === 'app',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('should create a security', () => {
    const payload = { tickerSymbol: 'AAPL' } as any;
    service.createSecurity(payload).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(payload);
  });

  it('should update a security', () => {
    const payload = { tickerSymbol: 'AAPL' } as any;
    service.updateSecurity(1, payload).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(payload);
  });

  it('should delete a security', () => {
    service.deleteSecurity(1).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should fetch the total security count for a user', () => {
    service.getUserSecurityTotal(1).subscribe((data) => {
      expect(data).toBe(3);
    });

    const req = httpMock.expectOne((r) => r.url === `${baseUrl}/total` && r.params.get('userId') === '1');
    expect(req.request.method).toBe('GET');
    req.flush(3);
  });

  it('should fetch the top securities for a user', () => {
    const mockTop = [{ securityId: 1, name: 'Apple', value: 500 }];
    service.getTopSecurities(1).subscribe((data) => {
      expect(data).toEqual(mockTop);
    });

    const req = httpMock.expectOne((r) => r.url === `${baseUrl}/top` && r.params.get('userId') === '1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTop);
  });

  it('should fetch the security type breakdown for a user', () => {
    const mockBreakdown = [{ type: 'Stock', count: 2 }];
    service.getSecurityTypeBreakdown(1).subscribe((data) => {
      expect(data).toEqual(mockBreakdown);
    });

    const req = httpMock.expectOne(
      (r) => r.url === `${baseUrl}/breakdown/type` && r.params.get('userId') === '1',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockBreakdown);
  });

  it('should fetch the sector breakdown for a user', () => {
    const mockBreakdown = [{ sector: 'Technology', count: 4 }];
    service.getSectorBreakdown(1).subscribe((data) => {
      expect(data).toEqual(mockBreakdown);
    });

    const req = httpMock.expectOne(
      (r) => r.url === `${baseUrl}/breakdown/sector` && r.params.get('userId') === '1',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockBreakdown);
  });
});
