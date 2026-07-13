import { Component, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { User } from '../../types/User';
import { UserService } from '../../services/UserService';
import { UserModal } from '../user-modal/user-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-user-handle',
  imports: [AvatarModule, UserModal],
  templateUrl: './user-handle.html',
  styleUrl: './user-handle.css',
})
export class UserHandle {

  currentUser = signal<User | null>(null); 
  isModalVisible = signal<boolean>(false);

  form! : FormGroup;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    this.loadUser();

    this.form = this.formBuilder.group({
      username: ["", [Validators.required, Validators.minLength(2)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  loadUser(): void {
    
    // change this when we implement authentication
    this.userService.viewProfile(1).subscribe({
      next: (data) => {
        this.currentUser.set(data);
      },
      error: (err) => {
        console.log(err);
      }

    })
  }

  openModal(): void {
    this.isModalVisible.set(true);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
  }

  async saveUser(formData: any) {

    const updatedUser: User = { ...this.currentUser(), ...formData };

    this.userService.updateUser(updatedUser.id!, updatedUser).subscribe({
      next: (response) => {
        this.isModalVisible.set(false);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  
}
