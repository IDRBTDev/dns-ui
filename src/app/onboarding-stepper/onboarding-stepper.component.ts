import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { NameServerFormComponent } from '../name-server-form/name-server-form.component';
import { OrganisationDetailsComponent } from '../organisation-details/organisation-details.component';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-onboarding-stepper',
  templateUrl: './onboarding-stepper.component.html',
  styleUrls: ['./onboarding-stepper.component.css']
})
export class OnboardingStepperComponent implements OnInit{
  @ViewChild(MatStepper) stepper: MatStepper;  // Reference to the mat-stepper
  @ViewChild(NameServerFormComponent) nameServerFormComponent: NameServerFormComponent;
  @ViewChild(OrganisationDetailsComponent) organisationDetailsComponent: OrganisationDetailsComponent;
  completed= false;

  domainId: number = 0;
  applicationId: string = '';
  organisationId: number = 0;
  
  constructor(private router: Router){
    this.domainId = this.router.getCurrentNavigation().extras.state['domainId'];
    this.applicationId = this.router.getCurrentNavigation().extras.state['applicationId'];
  }

  async ngOnInit(): Promise<void> {
    console.log(this.organisationId);
  }

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

  getEmittedOrgIdFromChild(organisationId: any){
    this.organisationId = organisationId;
    console.log(organisationId);
  }
}
