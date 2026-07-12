import { Directive, computed, inject, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Holding } from '../types/Holding';
import { HoldingService } from '../services/HoldingService';

@Directive()
export abstract class BaseDetailDirective<T> {
  holdings = signal<Holding[]>([]);
  loading = signal<boolean>(false);
  isHoldingModalVisible = signal<boolean>(false);
  editingHolding = signal<Holding | null>(null);

  totalInvestedCost = computed(() =>
    this.holdings().reduce((acc, h) => acc + h.shares * h.costPerShare, 0),
  );

  protected holdingService = inject(HoldingService);
  protected confirmationService = inject(ConfirmationService);

  /** Form control holding the FormGroup used by the add/edit holding modal. */
  protected abstract modalForm: WritableSignal<FormGroup>;

  /** Which form control on modalForm holds the "other side" of the holding (security for an account page, account for a security page). */
  protected abstract readonly counterpartyFormKey: 'security' | 'account';

  /** Resolve the account/security ids for a holding create/update payload from the modal's raw form value. */
  protected abstract resolveHoldingIds(formData: any): { a_id: number; s_id: number };

  constructor() {}

  /** Filter a list of candidates down to ones not already held, keyed by the holding id field the caller cares about. */
  protected excludeHeld<I extends { id?: number }>(
    all: I[],
    heldIdSelector: (h: Holding) => number | undefined,
  ): I[] {
    const heldIds = new Set(this.holdings().map(heldIdSelector));
    return all.filter((item) => !heldIds.has(item.id));
  }

  addHolding(): void {
    this.editingHolding.set(null);
    this.modalForm().reset();
    this.isHoldingModalVisible.set(true);
  }

  editHolding(holding: Holding): void {
    this.editingHolding.set(holding);

    const dateValue =
      typeof holding.purchaseDate === 'number'
        ? new Date(holding.purchaseDate)
        : holding.purchaseDate;

    this.modalForm().patchValue({
      [this.counterpartyFormKey]: holding[this.counterpartyFormKey],
      shares: holding.shares,
      costPerShare: holding.costPerShare,
      purchaseDate: dateValue,
    });

    this.isHoldingModalVisible.set(true);
  }

  onHoldingModalConfirm(formData: any): void {
    if (this.modalForm().invalid) return;

    const { a_id, s_id } = this.resolveHoldingIds(formData);
    const payload = {
      id: this.editingHolding()?.id,
      a_id,
      s_id,
      shares: formData.shares,
      costPerShare: formData.costPerShare,
      purchaseDate:
        formData.purchaseDate instanceof Date
          ? formData.purchaseDate.getTime()
          : formData.purchaseDate,
    };

    if (this.editingHolding()) {
      const id = payload.id;
      this.holdingService.updateHolding(id!, payload).subscribe({
        next: (updatedHolding) => {
          this.holdings.update((current) => current.map((h) => (h.id === id ? updatedHolding : h)));
        },
        error: (err) => console.error(err),
      });
    } else {
      this.holdingService.createHolding(payload).subscribe({
        next: (newHolding) => {
          this.holdings.update((current) => [...current, newHolding]);
        },
        error: (err) => console.error(err),
      });
    }
    this.isHoldingModalVisible.set(false);
  }

  confirmDeleteHolding(holding: Holding, event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this holding?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.executeDeleteHolding(holding);
      },
    });
  }

  private executeDeleteHolding(holding: Holding): void {
    this.holdingService.deleteHolding(holding.id!).subscribe({
      next: () => {
        this.holdings.update((current) =>
          current.filter(
            (h) =>
              h.id?.accountId !== holding.id?.accountId || h.id?.securityId !== holding.id?.securityId,
          ),
        );
      },
      error: (err) => console.error('Delete failed:', err),
    });
  }
}
