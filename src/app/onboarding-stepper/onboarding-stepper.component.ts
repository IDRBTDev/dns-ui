import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { NameServerFormComponent } from '../name-server-form/name-server-form.component';
import { OrganisationDetailsComponent } from '../organisation-details/organisation-details.component';
import { ContactDetailsFormComponent } from '../contact-details-form/contact-details-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PreviewComponent } from '../preview/preview.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-onboarding-stepper',
  templateUrl: './onboarding-stepper.component.html',
  styleUrls: ['./onboarding-stepper.component.css']
})
export class OnboardingStepperComponent implements OnInit{
  @ViewChild(MatStepper) stepper: MatStepper;  // Reference to the mat-stepper
  @ViewChild(NameServerFormComponent) nameServerFormComponent: NameServerFormComponent;
  @ViewChild(OrganisationDetailsComponent) organisationDetailsComponent: OrganisationDetailsComponent;
  @ViewChild(ContactDetailsFormComponent) contactDetailsFormComponent: OrganisationDetailsComponent;
  @ViewChild(PreviewComponent) previewComponent: PreviewComponent;
 

  completed= false;

  domainId: number = 0;
  applicationId: string = '';
  organisationId: number = 0;
 adminDocDetails :any;
 techDocDetails :any; 
 billDocDetails :any; 
 orgDocDetails :any; 
  constructor(private router: Router,private sanitizer: DomSanitizer){
    this.domainId = this.router.getCurrentNavigation().extras.state['domainId'];
    this.applicationId = this.router.getCurrentNavigation().extras.state['applicationId'];
    this.stepStates = [
      { completed: false, editable: true }, // Step 1
      { completed: false, editable: false }, // Step 2
      { completed: false, editable: false }, // Step 3
      { completed: false, editable: false }, // Step 4
      { completed: false, editable: false }  // Step 5
    ];
  }

  async ngOnInit(): Promise<void> {
    console.log(this.organisationId);
  }
  
  stepStates: { completed: boolean, editable: boolean }[] = [];
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    console.log("entered")
    $event.returnValue = 'Are you sure you want to leave? All unsaved changes will be lost.';
  }

  onStepChange(event: any) {
    const { selectedIndex, previouslySelectedIndex } = event;

    // Execute only when transitioning from "Name Server Details" (step 3) to "Preview" (step 4)
    if (previouslySelectedIndex === 2 && selectedIndex === 3) {
      console.log('Executing code for transition from Name Server to Preview step');
      this.previewComponent.fetchDataFromAPIs();
    }
    // If trying to go to the 'Name Server Details' step, ensure form validity
    if (event.selectedIndex === 1 && this.organisationDetailsComponent.isFormValid()) {
      event.preventDefault();  // Prevent navigation if the form is invalid
      console.log('Name server form is invalid!');
    }
  }

  onFormSubmitted(): void {
    // Move to the next step when the form is successfully submitted
    const currentStepIndex = this.stepper.selectedIndex;

    // Mark the current step as completed and non-editable
    this.stepStates[currentStepIndex].completed = true;
    this.stepStates[currentStepIndex].editable = false;

    // Make the next step editable (if it exists)
    if (currentStepIndex < this.stepStates.length - 1) {
      this.stepStates[currentStepIndex + 1].editable = true;
    }
    this.stepper.selected.completed = true;
    console.log("called the next")

    // Go to the next step (or you could leave it on the current step)
    this.stepper.next();  // Move to the next step in the stepper
  }
  SubmittedAdminDocs(adminDocs) {
   console.log(adminDocs)
   this.adminDocDetails=adminDocs
  }
  submittedTechDocDetails(techDocs){
    console.log(techDocs)
    this.techDocDetails=techDocs
  }
  submittedBillDocDetails(billDocs){
    console.log(billDocs)
    this.billDocDetails=billDocs
  }
  SubmittedOrgDocs(orgDoc){
    console.log(orgDoc);
    this.orgDocDetails=orgDoc;
  }

  goBack():void{
    this.stepper.previous();
  }

  getEmittedOrgIdFromChild(organisationId: any){
    this.organisationId = organisationId;
    console.log(organisationId);
  }

}
