import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHandle } from './user-handle';

describe('UserHandle', () => {
  let component: UserHandle;
  let fixture: ComponentFixture<UserHandle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHandle],
    }).compileComponents();

    fixture = TestBed.createComponent(UserHandle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
