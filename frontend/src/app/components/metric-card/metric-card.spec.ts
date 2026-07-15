import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetricCard } from './metric-card';
import { it, expect, describe, beforeEach } from 'vitest';

describe('MetricCard', () => {
  let component: MetricCard;
  let fixture: ComponentFixture<MetricCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricCard],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricCard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default value of 0 when no data input is provided', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const valueElement = compiled.querySelector('.text-2xl');
    expect(valueElement?.textContent).toBe('0');
  });

  it('should update the view when the data signal input changes', async () => {
    // 1. Set the input
    fixture.componentRef.setInput('data', 500);
    // 2. Set other inputs
    fixture.componentRef.setInput('title', 'Total Revenue');
    
    // 3. Trigger Change Detection
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    
    // Assert value
    expect(compiled.querySelector('.text-2xl')?.textContent).toBe('500');
    // Assert title
    expect(compiled.querySelector('.text-sm')?.textContent).toBe('Total Revenue');
  });
});