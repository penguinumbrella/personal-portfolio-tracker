import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { User } from '../../types/User';
import { AuthService } from '../../services/AuthService';
import { UserModal } from '../user-modal/user-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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

  currentUser = this.authService.currentUser;
  isModalVisible = signal<boolean>(false);

  form!: FormGroup;

  ngOnInit(): void {
    this.loadUser();

    this.form = this.formBuilder.group({
      username: ["", [Validators.required, Validators.minLength(2)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  loadUser(): void {
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
    const { password, ...rest } = formData;
    const updatedUser: User = { ...this.currentUser(), ...rest, passwordHash: password };

    this.authService.updateCurrentUser(updatedUser).subscribe({
      next: () => {
        this.isModalVisible.set(false);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.isModalVisible.set(false);
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
