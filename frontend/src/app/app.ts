import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { UserHandle } from './components/user-handle/user-handle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, UserHandle],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
