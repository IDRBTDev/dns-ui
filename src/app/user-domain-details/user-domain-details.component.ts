// src/app/user-domain-details/user-domain-details.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDomainService } from './service/user-domain.service';  // Import the service from the new folder
import { NavigationExtras, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { OrganisationDetailsService } from '../organisation-details/service/organisation-details.service';
import { HttpStatusCode } from '@angular/common/http';
import { ReminderComponent } from '../reminder/reminder.component';

@Component({
  selector: 'app-user-domain-details',
  templateUrl: './user-domain-details.component.html',
  styleUrls: ['./user-domain-details.component.css']
})

export class UserDomainDetailsComponent implements OnInit {
  userDomainForm: FormGroup;
  showResult = false;
  userId: string = localStorage.getItem('email');
  organisationId: number = parseInt(localStorage.getItem('organisationId'));

  @ViewChild(ReminderComponent) reminder: ReminderComponent | undefined;
  submissionError: string;
  isSubmitting: boolean;

  ngOnInit(): void {
      console.log(this.organisationId);
      // this.userDomainForm = this.fb.group({
      //   zone: ['', Validators.required],
      //   label: ['', Validators.required]
      // });
  }
  
  constructor(

    private fb: FormBuilder,

    private userDomainService: UserDomainService,  // Inject the service here

    public router:Router, private organisationService: OrganisationDetailsService

  ) {
    this.userDomainForm = this.fb.group({
 
      label: ['', [Validators.required, Validators.minLength(3)]],
 
      zone: ['', Validators.required],
 
      numberOfYears: [5],  // Default value for number of years
    cost: [5900]   
 
    });
  }


  zone: string = '';
  label: string = '';
  isReserved: boolean | null = null;

  // onSearch(): void {
  //   if (this.userDomainForm.valid) {
  //     const zone = this.userDomainForm.get('zone')?.value;
  //     const label = this.userDomainForm.get('label')?.value;

      
  //     this.userDomainService.validateReservedDomain(zone, label).subscribe(
  //       (isReserved) => {
  //         this.isReserved = isReserved;
  //         this.showResult = true;
  //       },
  //       (error) => {
  //         console.error('Error validating domain:', error);
  //         this.showResult = false;
  //       }
  //     );
  //   }
  // }

  onSearch() {
    const bankName = this.userDomainForm.get('label')?.value;
    const domainName = this.userDomainForm.get('zone')?.value;
    const zone = this.userDomainForm.get('zone')?.value;  // This could be a select option like '.bank.in', '.fin.in', etc.
    const label = this.userDomainForm.get('label')?.value;  // This is the bank name or identifier.
  
    // Make the API call to check both combinations
    this.userDomainService.checkDomainCombination(bankName, domainName, zone, label).subscribe(
      (response: boolean) => {
        if (response) {
          this.isReserved = false;  // Available
          this.showResult = true;
        } else {
          this.isReserved = true;   // Reserved
          this.showResult = true;
        }
      },
      (error) => {
        console.error('Error checking domain combination:', error);
      }
    );
  }
  

 

  organisationDetails: any;

  async getOrganisationDetailsById(organisationId: number){

    await lastValueFrom(this.organisationService.getOrganisationDetailsByOrganisationId(organisationId)).then(

      response => {

        if(response.status === HttpStatusCode.Ok){

          this.organisationDetails = response.body;

          console.log(response.body);

        }

      }

    )

  }

 

  // Handle form submission

  // async onSubmit() {

  //   if(this.organisationId > 0){

  //     await this.getOrganisationDetailsById(this.organisationId);

  //   }

  //   if (this.userDomainForm.valid) {

  //     this.showResult = true;

  //     const domainData = this.userDomainForm.value;

  //     console.log(this.userDomainForm.value);

  //     domainData.userMailId = this.userId;
  //     domainData.organisationId = this.organisationId;

  //     if(this.organisationDetails != null && this.organisationDetails != undefined){

  //       domainData.organizationName = this.organisationDetails.institutionName;

  //     }else{

  //       domainData.organizationName = 'Onboarding Pending';

  //     }

  //     console.log(domainData)

      

  //     this.userDomainService.sendDomainData(domainData).subscribe(

  //       (response) => {

  //         console.log('Domain data submitted successfully', response);

  //         let navigationExtras: NavigationExtras = {

  //           state: {

  //             domainId: response.domainId,

  //             applicationId: response.applicationId,

  //             organisationId: this.organisationId

  //           }

  //         }

  //         console.log(navigationExtras);

  //         if(this.organisationId < 1){

  //           this.router.navigate(['/onboarding-stepper'], navigationExtras);

  //         }else{

  //           this.router.navigateByUrl('/name-server',navigationExtras);

  //         }

         

  //       },

  //       (error) => {

  //         console.error('Error submitting domain data', error);

  //       }

  //     );

     

  //   }

  //   else{

  //       this.userDomainForm.markAllAsTouched();

  //   }

   

  // }

  onSubmit() {
    if (this.userDomainForm.valid) {
      const domainData = {
        bankName: this.userDomainForm.get('label')?.value,
        domainName: this.userDomainForm.get('zone')?.value,
        numberOfYears: this.userDomainForm.get('numberOfYears')?.value,
        cost: this.userDomainForm.get('cost')?.value,
        organisationId: this.organisationId
      };

      console.log('Submitting data:', domainData);

      // If domain is reserved, prevent submission
      if (this.isReserved) {
        alert('The combination of Bank Name and Domain is already reserved. Please choose a different one.');
        return;
      }
      this.userDomainService.sendDomainData(domainData).subscribe(
      
        (response) => {

          console.log('Domain data submitted successfully', response);

          let navigationExtras: NavigationExtras = {

            state: {

              domainId: response.domainId,

              applicationId: response.applicationId,

              organisationId: this.organisationId

            }

          }

          console.log(navigationExtras);

          if(this.organisationId < 1){

            this.router.navigate(['/onboarding-stepper'], navigationExtras);

          }else{

            this.router.navigateByUrl('/name-server',navigationExtras);

          }

         

        },

        (error) => {

          console.error('Error submitting domain data', error);

        }

      );

     

    }

    else{

        this.userDomainForm.markAllAsTouched();

    }
  
  }

  backButton(){

    this.router.navigateByUrl('domains');

  }

}