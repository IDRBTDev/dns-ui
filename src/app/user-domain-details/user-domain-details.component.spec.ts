import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDomainDetailsComponent } from './user-domain-details.component';

describe('UserDomainDetailsComponent', () => {
  let component: UserDomainDetailsComponent;
  let fixture: ComponentFixture<UserDomainDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserDomainDetailsComponent]
    });
    fixture = TestBed.createComponent(UserDomainDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
