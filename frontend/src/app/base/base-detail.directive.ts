import { Directive, computed, inject, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Holding } from '../types/Holding';
import { HoldingService } from '../services/HoldingService';
import { AuthService } from '../services/AuthService';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { extractErrorMessage } from '../shared/http.util';

@Directive()
export abstract class BaseDetailDirective<T> {
  holdings = signal<Holding[]>([]);
  loading = signal<boolean>(false);
  isHoldingModalVisible = signal<boolean>(false);
  editingHolding = signal<Holding | null>(null);

  /** The signed-in user's id, resolved once via resolveCurrentUserId() before any data loads. */
  currentUserId = signal<number | null>(null);

  totalInvestedCost = computed(() =>
    this.holdings().reduce((acc, h) => acc + h.shares * h.costPerShare, 0),
  );

  protected holdingService = inject(HoldingService);
  protected confirmationService = inject(ConfirmationService);
  protected messageService = inject(MessageService);
  private authService = inject(AuthService);
  protected actRoute = inject(ActivatedRoute);
  protected location = inject(Location);

  /**
   * Resolves the signed-in user's id, then runs the callback (call from ngOnInit before loading any data).
   * Always re-verifies with the server rather than trusting a cached value, so switching accounts
   * never leaves a page showing the previous session's data.
   */
  protected resolveCurrentUserId(onResolved: () => void): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserId.set(user.id!);
        onResolved();
      },
      error: (err) => console.error('Failed to resolve current user:', err),
    });
  }

  /** Form control holding the FormGroup used by the add/edit holding modal. */
  protected abstract modalForm: WritableSignal<FormGroup>;

  /** Which form control on modalForm holds the "other side" of the holding (security for an account page, account for a security page). */
  protected abstract readonly counterpartyFormKey: 'security' | 'account';

  /** Resolve the account/security ids for a holding create/update payload from the modal's raw form value. */
  protected abstract resolveHoldingIds(formData: any): { a_id: number; s_id: number };

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
    this.modalForm().reset({
      [this.counterpartyFormKey]: null,
      shares: 0,
      costPerShare: 0,
      purchaseDate: this.todayForDateInput(),
    });
    this.isHoldingModalVisible.set(true);
  }

  /** Today's date formatted as yyyy-MM-dd, the format a native <input type="date"> expects. */
  private todayForDateInput(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
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
      purchaseDate: new Date(formData.purchaseDate).getTime(),
    };

    if (this.editingHolding()) {
      const id = payload.id;
      this.holdingService.updateHolding(id!, payload).subscribe({
        next: (updatedHolding) => {
          this.holdings.update((current) => current.map((h) => (h.id === id ? updatedHolding : h)));
          this.isHoldingModalVisible.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Holding updated successfully.',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: extractErrorMessage(err, 'Failed to update holding.'),
          });
        },
      });
    } else {
      this.holdingService.createHolding(payload).subscribe({
        next: (newHolding) => {
          this.holdings.update((current) => [...current, newHolding]);
          this.isHoldingModalVisible.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Created',
            detail: 'Holding added successfully.',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: extractErrorMessage(err, 'Failed to create holding.'),
          });
        },
      });
    }
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
              h.id?.accountId !== holding.id?.accountId ||
              h.id?.securityId !== holding.id?.securityId,
          ),
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Holding deleted successfully.',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: extractErrorMessage(err, 'Failed to delete holding.'),
        });
      },
    });
  }
}
