import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarsDashboardComponent } from './registrars-dashboard.component';

describe('RegistrarsDashboardComponent', () => {
  let component: RegistrarsDashboardComponent;
  let fixture: ComponentFixture<RegistrarsDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrarsDashboardComponent]
    });
    fixture = TestBed.createComponent(RegistrarsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
