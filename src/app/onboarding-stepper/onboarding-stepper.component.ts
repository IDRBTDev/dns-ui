import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-onboarding-stepper',
  templateUrl: './onboarding-stepper.component.html',
  styleUrls: ['./onboarding-stepper.component.css']
})
export class OnboardingStepperComponent {
  @ViewChild(MatStepper) stepper: MatStepper;  // Reference to the mat-stepper

  onFormSubmitted(): void {
    // Move to the next step when the form is successfully submitted
    this.stepper.next();  // Move to the next step in the stepper
  }
  goBack():void{
    this.stepper.previous();
  }
}
