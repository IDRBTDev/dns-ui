import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { NameServerFormComponent } from '../name-server-form/name-server-form.component';
import { OrganisationDetailsComponent } from '../organisation-details/organisation-details.component';


@Component({
  selector: 'app-onboarding-stepper',
  templateUrl: './onboarding-stepper.component.html',
  styleUrls: ['./onboarding-stepper.component.css']
})
export class OnboardingStepperComponent{
  @ViewChild(MatStepper) stepper: MatStepper;  // Reference to the mat-stepper
  @ViewChild(NameServerFormComponent) nameServerFormComponent: NameServerFormComponent;
  @ViewChild(OrganisationDetailsComponent) organisationDetailsComponent: OrganisationDetailsComponent;
  completed= false;
  onStepChange(event: any) {
    // If trying to go to the 'Name Server Details' step, ensure form validity
    if (event.selectedIndex === 1 && this.organisationDetailsComponent.isFormValid()) {
      event.preventDefault();  // Prevent navigation if the form is invalid
      console.log('Name server form is invalid!');
    }
  }
  onFormSubmitted(): void {
    // Move to the next step when the form is successfully submitted
    this.completed=true;
    this.stepper.selected.completed = true;
    this.stepper.next();  // Move to the next step in the stepper
  }
  goBack():void{
    this.stepper.previous();
  }
}
