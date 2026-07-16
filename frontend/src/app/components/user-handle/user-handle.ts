import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { MessageService } from 'primeng/api';
import { User } from '../../types/User';
import { AuthService } from '../../services/AuthService';
import { UserModal } from '../user-modal/user-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { extractErrorMessage } from '../../shared/http.util';


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

  currentUser = this.authService.currentUser;
  isModalVisible = signal<boolean>(false);

  form!: FormGroup;

  ngOnInit(): void {
    // Refresh the current user from the server, then set up the edit-profile form
    this.loadUser();

    this.form = this.formBuilder.group({
      username: ["", [Validators.required, Validators.minLength(2)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  loadUser(): void {
    // Side-effecting call: AuthService updates its own currentUser signal on success,
    // so there's nothing to do here besides logging failures
    this.authService.getCurrentUser().subscribe({
      error: (err) => {
        console.error(err);
      }
    })
  }

  openModal(): void {
    this.isModalVisible.set(true);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
  }

  saveUser(formData: any) {
    // Rename the form's "password" field to "passwordHash" (what the API expects) and
    // merge it over the existing user record
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

  logout(): void {
    // Close the modal and redirect to login on success; show a toast on failure
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
