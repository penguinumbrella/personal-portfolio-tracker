import { Component, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { User } from '../../types/User';
import { UserService } from '../../services/UserService';
import { UserModal } from '../user-modal/user-modal';


@Component({
  selector: 'app-user-handle',
  imports: [AvatarModule, UserModal],
  templateUrl: './user-handle.html',
  styleUrl: './user-handle.css',
})
export class UserHandle {

  currentUser = signal<User | null>(null); 
  isModalVisible = signal<boolean>(false);

  constructor(
    private userService: UserService
  ){}

  ngOnInit(): void {
    this.loadUser();
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

  handleConfirm(): void {
    console.log('handle confirmed called');
    this.closeModal();
  }
  
}
