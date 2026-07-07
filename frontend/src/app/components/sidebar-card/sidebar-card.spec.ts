import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarCard } from './sidebar-card';

describe('SidebarCard', () => {
  let component: SidebarCard;
  let fixture: ComponentFixture<SidebarCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
