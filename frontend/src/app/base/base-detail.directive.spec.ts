import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BaseDetailDirective } from './base-detail.directive';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HoldingService } from '../services/HoldingService';
import { AuthService } from '../services/AuthService';
import { ConfirmationService } from 'primeng/api';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fakeAsync, tick } from '@angular/core/testing';

// 1. Concrete implementation for testing
class TestDetail extends BaseDetailDirective<any> {
  // modalForm must be a signal to match the abstract class definition
  modalForm = signal<FormGroup>(new FormGroup({
    shares: new FormControl(0),
    costPerShare: new FormControl(0),
    purchaseDate: new FormControl(new Date()),
    security: new FormControl(null)
  }));
  
  counterpartyFormKey = 'security' as const;
  resolveHoldingIds = () => ({ a_id: 1, s_id: 2 });

  // Promote protected method to public for test access
  public override excludeHeld<I extends { id?: number }>(
    all: I[],
    heldIdSelector: (h: any) => number | undefined,
  ): I[] {
    return super.excludeHeld(all, heldIdSelector);
  }
}

// 2. Host component to provide the context for the directive
@Component({
  template: '',
  providers: [
    { provide: HoldingService, useValue: { 
        createHolding: () => of({id: 1}), 
        updateHolding: () => of({id: 1}), 
        deleteHolding: () => of({}) 
    }},
    { provide: AuthService, useValue: { getCurrentUser: () => of({ id: 1 }) } },
    ConfirmationService
  ]
})
class TestHarnessComponent extends TestDetail {}

describe('BaseDetailDirective Comprehensive', () => {
  let directive: TestDetail;
  let holdingService: HoldingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TestHarnessComponent]
    });

    const fixture = TestBed.createComponent(TestHarnessComponent);
    directive = fixture.componentInstance;
    holdingService = fixture.componentRef.injector.get(HoldingService);
  });

  it('should reset modalForm correctly on addHolding', () => {
    const resetSpy = vi.spyOn(directive.modalForm(), 'reset');
    directive.addHolding();
    expect(directive.isHoldingModalVisible()).toBe(true);
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should patch modalForm correctly on editHolding', () => {
    const patchSpy = vi.spyOn(directive.modalForm(), 'patchValue');
    const mockHolding = { shares: 5, costPerShare: 10, security: { id: 1 } } as any;
    directive.editHolding(mockHolding);
    expect(patchSpy).toHaveBeenCalled();
    expect(directive.editingHolding()).toEqual(mockHolding);
  });

  it('should call createHolding on confirm if not editing', () => {
  const spy = vi.spyOn(holdingService, 'createHolding');

  const form = directive.modalForm();
  
  // 1. Set values explicitly matching your FormGroup structure
  form.setValue({
    security: { id: 1 }, 
    shares: 10,
    costPerShare: 5,
    purchaseDate: new Date('2026-07-15') // Use Date object if FormGroup expects it
  });

  // 2. Force validation and log status
  form.updateValueAndValidity();
  
  if (form.invalid) {
    console.log('Form is invalid. Errors:', form.errors);
    // Log individual controls if the group is invalid
    Object.keys(form.controls).forEach(key => {
      if (form.get(key)?.invalid) {
        console.log(`Control ${key} is invalid:`, form.get(key)?.errors);
      }
    });
  }

  // 3. Act
  directive.onHoldingModalConfirm(form.value);

  // 4. Assert
  expect(spy).toHaveBeenCalled();
});
  it('should filter holdings correctly in excludeHeld', () => {
    directive.holdings.set([{ id: { securityId: 1 } } as any]);
    const candidates = [{ id: 1 }, { id: 2 }];
    const result = directive.excludeHeld(candidates, (h) => h.id?.securityId);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(2);
  });
});