import { Component } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-sidebar',
  imports: [DrawerModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  visible: boolean = false;

  onClose() {
    this.visible = false;
  }

  toggleSidebar() {
    this.visible = !this.visible;
  }
}
