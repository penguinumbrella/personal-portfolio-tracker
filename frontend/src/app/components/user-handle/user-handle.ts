import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';


@Component({
  selector: 'app-user-handle',
  imports: [AvatarModule],
  templateUrl: './user-handle.html',
  styleUrl: './user-handle.css',
})
export class UserHandle {}
