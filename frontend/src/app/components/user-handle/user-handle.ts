import { Component, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { User } from '../../types/User';
import { UserService } from '../../services/UserService';


@Component({
  selector: 'app-user-handle',
  imports: [AvatarModule],
  templateUrl: './user-handle.html',
  styleUrl: './user-handle.css',
})
export class UserHandle {

  currentUser = signal<User | null>(null); 

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

  
}
