import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTable } from './dashboard-table';
import { CardModule } from 'primeng/card';
import { provideRouter } from '@angular/router';

describe('DashboardTable', () => {
  let component: DashboardTable;
  let fixture: ComponentFixture<DashboardTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTable, CardModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
