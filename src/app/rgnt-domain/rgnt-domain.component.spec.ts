import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainComponent } from './rgnt-domain.component';

describe('DomainComponent', () => {
  let component: DomainComponent;
  let fixture: ComponentFixture<DomainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DomainComponent]
    });
    fixture = TestBed.createComponent(DomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
