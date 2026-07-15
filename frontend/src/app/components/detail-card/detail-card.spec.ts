import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailCard } from './detail-card';
import { it, expect, describe, beforeEach, vi } from 'vitest';

describe('DetailCard', () => {
  let component: DetailCard;
  let fixture: ComponentFixture<DetailCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailCard],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailCard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the provided title', () => {
    fixture.componentRef.setInput('title', 'Account Details');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.text-xl')?.textContent).toContain('Account Details');
  });

  it('should render the correct number of fields', () => {
    const mockFields = [
      { label: 'Name', value: 'John Doe' },
      { label: 'Balance', value: '$1000' }
    ];
    fixture.componentRef.setInput('fields', mockFields);
    fixture.detectChanges();

    const fieldElements = fixture.nativeElement.querySelectorAll('.flex.flex-col');
    expect(fieldElements.length).toBe(2);
    expect(fieldElements[0].textContent).toContain('Name');
    expect(fieldElements[0].textContent).toContain('John Doe');
  });

  it('should emit onEdit when the Edit button is clicked', () => {
    const spy = vi.spyOn(component.onEdit, 'emit');
    fixture.detectChanges();
    
    // Find the button inside the p-button component
    const button = fixture.nativeElement.querySelectorAll('button')[0];
    button.click();
    fixture.detectChanges();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should emit onDelete when the Delete button is clicked', () => {
    const spy = vi.spyOn(component.onDelete, 'emit');
    fixture.detectChanges();
    
    // Find the second button
    const button = fixture.nativeElement.querySelectorAll('button')[1];
    button.click();
    fixture.detectChanges();
    
    expect(spy).toHaveBeenCalled();
  });
});