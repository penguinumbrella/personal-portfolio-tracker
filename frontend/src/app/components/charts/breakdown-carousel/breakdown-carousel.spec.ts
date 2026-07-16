import { TestBed } from '@angular/core/testing';
import { BreakdownCarousel } from './breakdown-carousel';
import { describe, it, expect, beforeEach } from 'vitest';

describe('BreakdownCarousel', () => {
  let component: BreakdownCarousel;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [BreakdownCarousel] });
    const fixture = TestBed.createComponent(BreakdownCarousel);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('titles', ['Securities by Type', 'Accounts by Type', 'Securities by Sector']);
  });

  it('starts on the first title', () => {
    expect(component.activeTitle).toBe('Securities by Type');
  });

  it('next() advances to the following title', () => {
    component.next();
    expect(component.activeTitle).toBe('Accounts by Type');
  });

  it('next() wraps around from the last title to the first', () => {
    component.next();
    component.next();
    component.next();
    expect(component.activeTitle).toBe('Securities by Type');
  });

  it('previous() goes back to the prior title', () => {
    component.next();
    component.previous();
    expect(component.activeTitle).toBe('Securities by Type');
  });

  it('previous() wraps around from the first title to the last', () => {
    component.previous();
    expect(component.activeTitle).toBe('Securities by Sector');
  });
});
