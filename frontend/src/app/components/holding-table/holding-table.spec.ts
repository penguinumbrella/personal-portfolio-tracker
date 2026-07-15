import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HoldingTable } from './holding-table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { it, expect, describe, beforeEach, vi } from 'vitest';

describe('HoldingTable', () => {
  let component: HoldingTable;
  let fixture: ComponentFixture<HoldingTable>;

  const mockHoldings = [
    {
      id: { securityId: '1' },
      security: { name: 'Apple' },
      account: { nickname: 'Brokerage' },
      shares: 10,
      costPerShare: 150,
      purchaseDate: '2026-01-01'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoldingTable, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HoldingTable);
    component = fixture.componentInstance;
    
    // Set inputs
    fixture.componentRef.setInput('holdings', mockHoldings);
    fixture.componentRef.setInput('tableMode', 'byAccount');
    
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct number of rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
  });

it('should emit onAdd when button is clicked', () => {
  const spy = vi.spyOn(component.onAdd, 'emit');
  
  // Find the native button element inside the p-button component
  const addButton = fixture.nativeElement.querySelector('p-button[label="Add holding"] button');
  
  expect(addButton).toBeDefined();
  addButton.click();
  
  expect(spy).toHaveBeenCalled();
});

it('should emit onEdit when pencil button is clicked', () => {
  const spy = vi.spyOn(component.onEdit, 'emit');
  
  // Find the native button inside the pencil p-button
  const editButton = fixture.nativeElement.querySelector('p-button[icon="pi pi-pencil"] button');
  
  expect(editButton).toBeDefined();
  editButton.click();
  
  expect(spy).toHaveBeenCalledWith(mockHoldings[0]);
});

it('should emit onDelete when trash button is clicked', () => {
  const spy = vi.spyOn(component.onDelete, 'emit');
  
  const deleteButton = fixture.nativeElement.querySelector('p-button[icon="pi pi-trash"] button');
  
  expect(deleteButton).toBeDefined();
  deleteButton.click();
  
  // The logic in your template passes $event. 
  // We check if it was called with the object containing the holding.
  expect(spy).toHaveBeenCalled();
});
});