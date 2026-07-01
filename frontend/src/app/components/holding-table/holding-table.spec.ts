import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldingTable } from './holding-table';

describe('HoldingTable', () => {
  let component: HoldingTable;
  let fixture: ComponentFixture<HoldingTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoldingTable],
    }).compileComponents();

    fixture = TestBed.createComponent(HoldingTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
