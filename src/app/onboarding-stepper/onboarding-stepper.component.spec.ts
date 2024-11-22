import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingStepperComponent } from './onboarding-stepper.component';

describe('OnboardingStepperComponent', () => {
  let component: OnboardingStepperComponent;
  let fixture: ComponentFixture<OnboardingStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingStepperComponent]
    });
    fixture = TestBed.createComponent(OnboardingStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
