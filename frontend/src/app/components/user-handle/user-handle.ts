import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { MessageService } from 'primeng/api';
import { User } from '../../types/User';
import { AuthService } from '../../services/AuthService';
import { UserModal } from '../user-modal/user-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { extractErrorMessage } from '../../shared/http.util';


/** Avatar/menu showing the signed-in user, with a modal for editing their profile and logging out. */
@Component({
  selector: 'app-user-handle',
  imports: [AvatarModule, UserModal],
  templateUrl: './user-handle.html',
  styleUrl: './user-handle.css',
})
export class UserHandle {

  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);

  /** The signed-in user, mirrored from {@link AuthService}. */
  currentUser = this.authService.currentUser;

  /** Whether the edit-profile modal is visible. */
  isModalVisible = signal<boolean>(false);

  /** The edit-profile form, built in {@link ngOnInit}. */
  form!: FormGroup;

  /** Refreshes the current user from the server, then sets up the edit-profile form. */
  ngOnInit(): void {
    this.loadUser();

    this.form = this.formBuilder.group({
      username: ["", [Validators.required, Validators.minLength(2)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  /**
   * Refreshes the signed-in user from the server. This is a side-effecting call: {@link AuthService}
   * updates its own `currentUser` signal on success, so there's nothing to do here besides logging failures.
   */
  loadUser(): void {
    this.authService.getCurrentUser().subscribe({
      error: (err) => {
        console.error(err);
      }
    })
  }

  /** Opens the edit-profile modal. */
  openModal(): void {
    this.isModalVisible.set(true);
  }

  /** Closes the edit-profile modal. */
  closeModal(): void {
    this.isModalVisible.set(false);
  }

  /**
   * Updates the signed-in user's profile. Renames the form's "password" field to "passwordHash"
   * (what the API expects) and merges it over the existing user record.
   *
   * @param formData the edit-profile form's raw value
   */
  saveUser(formData: any) {
    const { password, ...rest } = formData;
    const updatedUser: User = { ...this.currentUser(), ...rest, passwordHash: password };

    this.authService.updateCurrentUser(updatedUser).subscribe({
      next: () => {
        this.isModalVisible.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Profile updated successfully.',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: extractErrorMessage(err, 'Failed to update profile.'),
        });
      }
    });
  }

  /** Logs out the current session, closing the modal and redirecting to login on success. */
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.isModalVisible.set(false);
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: extractErrorMessage(err, 'Failed to log out.'),
        });
      }
    });
  }

}
