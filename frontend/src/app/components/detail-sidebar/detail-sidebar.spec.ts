import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSidebar } from './detail-sidebar';

describe('DetailSidebar', () => {
  let component: DetailSidebar;
  let fixture: ComponentFixture<DetailSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
