// src/app/user-domain-details/user-domain-details.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDomainService } from './service/user-domain.service';  // Import the service from the new folder
import { NavigationExtras, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { OrganisationDetailsService } from '../organisation-details/service/organisation-details.service';
import { HttpStatusCode } from '@angular/common/http';
import { ReminderComponent } from '../reminder/reminder.component';
import { DomainService } from '../rgnt-domain/service/domain.service';

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
  domainsList: any[];

  ngOnInit(): void {
      console.log(this.organisationId);
      // this.userDomainForm = this.fb.group({
      //   zone: ['', Validators.required],
      //   label: ['', Validators.required]
      // });
      if(this.organisationId > 0){
        this.getAllDomainsListByOrgId(this.organisationId);
      }else{
        this.domainsList = [];
      }
  }
  
  constructor(

    private fb: FormBuilder,

    private userDomainService: UserDomainService,  // Inject the service here
    
    private domainService: DomainService,

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
  
    // Check if both bank name and domain name are entered
    if (!bankName || !domainName) {
      // Mark form controls as touched to trigger validation errors
      this.userDomainForm.get('label')?.markAsTouched();
      this.userDomainForm.get('zone')?.markAsTouched();
      return;
    }
  
    const zone = this.userDomainForm.get('zone')?.value;
    const label = this.userDomainForm.get('label')?.value;
  
    // Make the API call to check domain combination
    this.userDomainService.checkDomainCombination(bankName, domainName, zone, label).subscribe(
      (response: boolean) => {
        if (response) {
          this.isReserved = false; // Available
          this.showResult = true;
  
          // Clear any existing validation errors after successful search
          this.userDomainForm.get('label')?.setErrors(null);
          this.userDomainForm.get('zone')?.setErrors(null);
        } else {
          this.isReserved = true; // Reserved
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

//   async onSubmit() {

//     if (this.userDomainForm.valid) {
//       const domainData = {
//         bankName: this.userDomainForm.get('label')?.value,
//         domainName: this.userDomainForm.get('zone')?.value,
//         numberOfYears: this.userDomainForm.get('numberOfYears')?.value,
//         cost: this.userDomainForm.get('cost')?.value,
//         organisationId: this.organisationId
//       };

//       console.log('Submitting data:', domainData);

//       // If domain is reserved, prevent submission
//       if (this.isReserved) {
//         alert('The combination of Bank Name and Domain is already reserved. Please choose a different one.');
//         return;
//       }

//     if(this.organisationId > 0){

//       await this.getOrganisationDetailsById(this.organisationId);

//     }

//     if (this.userDomainForm.valid) {

//       this.showResult = true;

//       const domainData = this.userDomainForm.value;

//       console.log(this.userDomainForm.value);

//       domainData.userMailId = this.userId;
//       domainData.organisationId = this.organisationId;

//       if(this.organisationDetails != null && this.organisationDetails != undefined){

//         domainData.organizationName = this.organisationDetails.institutionName;

//       }else{

//         domainData.organizationName = 'Onboarding Pending';

//       }

//       console.log(domainData)

      

//       this.userDomainService.sendDomainData(domainData).subscribe(

//         (response) => {

//           console.log('Domain data submitted successfully', response);

//           let navigationExtras: NavigationExtras = {

//             state: {

//               domainId: response.domainId,

//               applicationId: response.applicationId,

//               organisationId: this.organisationId

//             }

//           }

//           console.log(navigationExtras);

//           if(this.organisationId < 1){

//             this.router.navigate(['/onboarding-stepper'], navigationExtras);

//           }else{

//             this.router.navigateByUrl('/name-server',navigationExtras);

//           }

         

//         },

//         (error) => {

//           console.error('Error submitting domain data', error);

//         }

//       );

     

//     }

//     else{

//         this.userDomainForm.markAllAsTouched();

//     }

   

//   }
// }
  navigateToSessionTimeout() {
    this.router.navigateByUrl('/session-timeout');
  }
  
  async getAllDomainsListByOrgId(orgId: number) {
    console.log(orgId)
    await lastValueFrom(this.domainService.getAllDomainsByOrgId(orgId)).then(
      (response) => {
        if (response.status === HttpStatusCode.Ok) {
          this.domainsList = response.body;
          console.log(this.domainsList)
        }
      },
      (error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.navigateToSessionTimeout();
        }
      }
    );
  }
  
  async onSubmit() {
    if (this.userDomainForm.valid) {
      const domainData = {
        bankName: this.userDomainForm.get('label')?.value,
        domainName: this.userDomainForm.get('zone')?.value,
        numberOfYears: this.userDomainForm.get('numberOfYears')?.value,
        cost: this.userDomainForm.get('cost')?.value,
        organisationId: this.organisationId,
        organizationName: ''
      };

      console.log('Submitting data:', domainData);

      // If domain is reserved, prevent submission
      if (this.isReserved) {
        alert('The combination of Bank Name and Domain is already reserved. Please choose a different one.');
        return;
      }
      if(this.organisationId > 0){

        await this.getOrganisationDetailsById(this.organisationId);
  
      }
      if(this.organisationDetails != null && this.organisationDetails != undefined){

        domainData.organizationName = this.organisationDetails.institutionName;

      }else{

        domainData.organizationName = 'Onboarding Pending';

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