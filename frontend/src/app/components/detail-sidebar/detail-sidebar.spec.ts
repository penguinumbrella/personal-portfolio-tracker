import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailSidebar, SidebarItem } from './detail-sidebar';
import { it, expect, describe, beforeEach, vi } from 'vitest';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DetailSidebar', () => {
  let component: DetailSidebar;
  let fixture: ComponentFixture<DetailSidebar>;

  const mockItems: SidebarItem[] = [
    { id: 1, label: 'Item 1', subtitle: 'Sub 1' },
    { id: 2, label: 'Item 2', subtitle: 'Sub 2' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailSidebar, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailSidebar);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the list of items', () => {
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
    
    const elements = fixture.nativeElement.querySelectorAll('app-sidebar-card');
    expect(elements.length).toBe(2);
  });

  it('should display "No items found" when items list is empty', () => {
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();
    
    const emptyText = fixture.nativeElement.querySelector('p');
    expect(emptyText.textContent).toContain('No items found.');
  });

  it('should update selectedId and emit selected event on item click', () => {
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
    
    const spy = vi.spyOn(component.selected, 'emit');
    const itemElements = fixture.nativeElement.querySelectorAll('.rounded-lg');
    
    // Click the first item
    itemElements[0].click();
    fixture.detectChanges();
    
    expect(component.selectedId()).toBe(1);
    expect(spy).toHaveBeenCalledWith(mockItems[0]);
    expect(itemElements[0].classList.contains('bg-gray-900')).toBe(true);
  });

  it('should emit onAddItem when the Add button is clicked', () => {
    const spy = vi.spyOn(component.onAddItem, 'emit');
    fixture.detectChanges();
    
    const addButton = fixture.nativeElement.querySelector('button');
    addButton.click();
    
    expect(spy).toHaveBeenCalled();
  });
});