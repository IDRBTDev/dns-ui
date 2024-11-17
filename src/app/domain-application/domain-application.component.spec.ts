import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainApplicationComponent } from './domain-application.component';

describe('DomainApplicationComponent', () => {
  let component: DomainApplicationComponent;
  let fixture: ComponentFixture<DomainApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DomainApplicationComponent]
    });
    fixture = TestBed.createComponent(DomainApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
