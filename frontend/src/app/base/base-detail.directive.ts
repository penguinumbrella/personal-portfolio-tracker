import { Directive, computed, inject, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Holding } from '../types/Holding';
import { HoldingService } from '../services/HoldingService';
import { AuthService } from '../services/AuthService';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { extractErrorMessage } from '../shared/http.util';

/**
 * Base class for the account-detail and security-detail pages, sharing the holdings list, the
 * add/edit holding modal, and holding create/update/delete logic. Subclasses provide the
 * counterpart-specific form and id resolution (security for an account page, account for a
 * security page).
 */
@Directive()
export abstract class BaseDetailDirective<T> {
  /** The currently loaded holdings for the viewed account or security. */
  holdings = signal<Holding[]>([]);

  /** Whether a data request is in flight, for showing a loading spinner. */
  loading = signal<boolean>(false);

  /** Whether the add/edit holding modal is visible. */
  isHoldingModalVisible = signal<boolean>(false);

  /** The holding currently being edited, or `null` when the modal is in "create" mode. */
  editingHolding = signal<Holding | null>(null);

  /** The signed-in user's id, resolved once via resolveCurrentUserId() before any data loads. */
  currentUserId = signal<number | null>(null);

  /** Derived total cost basis across all currently loaded holdings. */
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
   *
   * @param onResolved called once `currentUserId` has been set
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

  /**
   * Resolve the account/security ids for a holding create/update payload from the modal's raw form value.
   *
   * @param formData the modal form's raw value
   * @returns the account id and security id for the holding payload
   */
  protected abstract resolveHoldingIds(formData: any): { a_id: number; s_id: number };

  /**
   * Filter a list of candidates down to ones not already held, keyed by the holding id field the
   * caller cares about.
   *
   * @param all the candidate items to filter
   * @param heldIdSelector selects the relevant id (account id or security id) off a holding
   * @returns the candidates not already represented among the current holdings
   */
  protected excludeHeld<I extends { id?: number }>(
    all: I[],
    heldIdSelector: (h: Holding) => number | undefined,
  ): I[] {
    const heldIds = new Set(this.holdings().map(heldIdSelector));
    return all.filter((item) => !heldIds.has(item.id));
  }

  /** Opens the add/edit holding modal in "create" mode, with the form reset to blank defaults. */
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

  /**
   * Opens the add/edit holding modal in "edit" mode, prefilled with the given holding's values.
   *
   * @param holding the holding to edit
   */
  editHolding(holding: Holding): void {
    this.editingHolding.set(holding);

    // purchaseDate may arrive as an epoch number (from the backend) or already a Date; normalize to Date.
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

  /**
   * Creates or updates a holding from the modal's form value, depending on whether one is
   * currently being edited. Bails out silently if the form isn't valid; PrimeNG form validation
   * messages handle the UI feedback.
   *
   * @param formData the modal form's raw value
   */
  onHoldingModalConfirm(formData: any): void {
    if (this.modalForm().invalid) return;

    // Subclasses know which raw form fields map to account/security ids.
    const { a_id, s_id } = this.resolveHoldingIds(formData);
    const payload = {
      id: this.editingHolding()?.id,
      a_id,
      s_id,
      shares: formData.shares,
      costPerShare: formData.costPerShare,
      // Convert the form's Date back to epoch millis for the API.
      purchaseDate: new Date(formData.purchaseDate).getTime(),
    };

    // Branch on whether we're editing an existing holding or creating a new one.
    if (this.editingHolding()) {
      const id = payload.id;
      this.holdingService.updateHolding(id!, payload).subscribe({
        next: (updatedHolding) => {
          // Swap the updated holding into local state in place.
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
          // Append the newly created holding to local state.
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

  /**
   * Shows a PrimeNG confirm popup anchored to the triggering element; only deletes the holding
   * on accept.
   *
   * @param holding the holding to delete if confirmed
   * @param event the triggering click event, used to anchor the popup
   */
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

  /**
   * Deletes a holding and removes it from local state by its composite (account, security) id.
   *
   * @param holding the holding to delete
   */
  private executeDeleteHolding(holding: Holding): void {
    this.holdingService.deleteHolding(holding.id!).subscribe({
      next: () => {
        // Remove the deleted holding from local state by its composite (account, security) id.
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
