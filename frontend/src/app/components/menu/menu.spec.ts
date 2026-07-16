import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Menu } from './menu';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { it, expect, describe, beforeEach } from 'vitest';

describe('Menu', () => {
  let component: Menu;
  let fixture: ComponentFixture<Menu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu],
      providers: [provideRouter([]), MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(Menu);
    component = fixture.componentInstance;
    
    // Trigger initial change detection and wait for stable state
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all menu items', async () => {
    // Re-check after potential async rendering
    await fixture.whenStable();
    const links = fixture.nativeElement.querySelectorAll('a.p-panelmenu-header-link');
    expect(links.length).toBe(3);
  });
});