// import { Component, OnInit, EventEmitter, Output } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { HttpClient, HttpStatusCode } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { OrganisationDetailsService } from './service/organisation-details.service';
// import { UserService } from '../user/service/user.service';
// import { lastValueFrom } from 'rxjs';

// @Component({
//     selector: 'app-organisation-details',
//     templateUrl: './organisation-details.component.html',
//     styleUrls: ['./organisation-details.component.css'],
// })
// export class OrganisationDetailsComponent implements OnInit {
//     @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>(); // Emit event after form submission
//     @ViewChild(DocumentUploadComponent,{static:false}) documentUploadComponent?:
//     organisationForm: FormGroup;
//     cityOptions: Array<{ name: string; district: string; state: string }> = [];
//     loading = false;
//     validationMessage = '';
//     submitted = false;
//     uploadedDocs: { type: string; fileName: string }[] = [];
//     submissionAttempted: boolean = false;

//     @Output() organisationId: EventEmitter<number> = new EventEmitter<number>();

//     constructor(
//         private fb: FormBuilder,
//         private http: HttpClient,
//         //private router: Router,
//         private organisationDetailsService: OrganisationDetailsService,
//         private userService: UserService,
//         private router: Router
//     ) {
//         this.organisationForm = this.fb.group({
//             organisationDetailsId:0,
//             institutionName: [''],
//             stdTelephone: [''],
//             mobileNumber: [''],
//             organisationEmail: [''],
//             address: [''],
//             pincode: [''],
//             city: [''],
//             district: [''],
//             state: [''],
//             userMailId:['']
//         });
//     }

//     userId: string = localStorage.getItem('email');

//     async ngOnInit() : Promise<void> {
//         await this.getCurrentLoggedInUserDetails();
//         this.organisationForm.get('userMailId').setValue(this.userId);
//         if (this.cityOptions.length > 1) {
//             this.organisationForm.get('city')?.setValue(this.cityOptions[1].name);
//         } else {
//             this.clearCityAndState();
//         }
//     }

//     fetchCityState(pincode: string): void {
//         this.loading = true;
//         this.http.get(`https://api.postalpincode.in/pincode/${pincode}`).subscribe(
//             (response: any) => {
//                 console.log('API Response:', response);
//                 this.loading = false;

//                 if (response[0]?.Status === 'Success') {
//                     const places = response[0].PostOffice;

//                     this.cityOptions = places.map((place: any) => ({
//                         name: place.Name + ', ' + place.District,
//                         district: place.District,
//                         state: place.State,
//                     }));

//                     if (this.cityOptions.length > 0) {
//                         this.organisationForm.patchValue({
//                             city: this.cityOptions[0].name || '',
//                             state: this.cityOptions[0].state || '',
//                         });
//                     } else {
//                         this.clearCityAndState();
//                     }
//                 } else {
//                     this.clearCityAndState();
//                 }
//             },
//             (error) => {
//                 console.error('Error fetching pincode details:', error);
//                 this.loading = false;
//                 this.clearCityAndState();
                
//             }
//         );
//     }

//     clearCityAndState(): void {
//         this.cityOptions = [];
//         this.organisationForm.patchValue({
//             city: '',
//             state: '',
//         });
//     }

//     onPincodeChange(): void {
//         const pincode = this.organisationForm.get('pincode')?.value;
//         if (pincode && /^\d{6}$/.test(pincode)) {
//             this.fetchCityState(pincode);
//         } else {
            
//             this.clearCityAndState();
//         }
//     }

//     handleValidationChange(isValid: boolean): void {
//         console.log('Validation status:', isValid);
//     }

//     setUploadedDocuments(docs: any[]): void {
//         this.uploadedDocs = docs;
//         console.log('Uploaded documents updated:', this.uploadedDocs);
//     }

//     async handleSubmit(): Promise<void> {
//         this.submitted = true;

//         if (this.organisationForm.invalid) {
//             this.organisationForm.markAllAsTouched();
//             console.error('Form validation failed. Details:');

//             Object.keys(this.organisationForm.controls).forEach((controlName) => {
//                 const control = this.organisationForm.get(controlName);
//                 if (control?.invalid) {
//                     console.error(
//                         `Field "${controlName}" is invalid. Errors:`,
//                         control.errors
//                     );
//                 }
//             });

//             this.validationMessage = 'Please fill all required fields correctly.';
//             return;
//         }
//         this.formSubmitted.emit();
//         console.log('Form is valid and ready for submission.');

//         const formData = {
//             ...this.organisationForm.value,
//         };

//         // this.organisationDetailsService.saveOrganisationDetails(formData).subscribe(
//         //     (response) => {
                
//         //         console.log('Form submitted successfully', response);
//         //         this.router.navigate(['/contact-details-form']);
//         //     },
//         //     (error) => {
//         //         console.log(formData);
//         //         console.error('Error submitting form', error);
//         //     }
//         // );
//         this.organisationDetailsService.saveOrganisationDetails(formData).subscribe(
//             (response: any) => {
//                 console.log('Form submitted successfully', response);

//                 this.updateOrganisationIdForUser(response.organisationDetailsId);
//                 localStorage.setItem('organisationId', response.organisationDetailsId);
//                 this.organisationId.emit(response.organisationDetailsId);

//                 const applicationId = response.applicationId; // Retrieve applicationId from the response
//                 console.log('Generated Application ID:', applicationId);
        
//                 if (applicationId) {
//                     sessionStorage.setItem('applicationId', applicationId); // Save to sessionStorage
//                     //this.router.navigate(['/contact-details-form']); // Navigate to Contact Details
//                 } else {
//                     console.error('Application ID is null or undefined!');
//                 }
//             },
//             (error) => {
//                 console.error('Error submitting form', error);
//             }
//         );
//     }
//         // Method to check form validity (to be used in parent)
//         isFormValid(): boolean {
//         return this.organisationForm.valid;
//      }

//      user: any
//     // userId: string = localStorage.getItem('email');
//      async getCurrentLoggedInUserDetails(){
//         console.log(this.userId)
//         await lastValueFrom(this.userService.getUserByEmailId(this.userId)).then(
//             response => {
//                 console.log(response);
//                 this.user = response.body;
//             }
//         )
//      }

//      async updateOrganisationIdForUser(organisationId: number){
//         this.user.organisationId = organisationId;
//         await lastValueFrom(this.userService.updateUser(this.user)).then(
//             response => {
//                 if(response.status === HttpStatusCode.PartialContent){
//                     console.log('org id updated for the user');
//                 }
//             }, error => {
//                 if(error.status === HttpStatusCode.Unauthorized){
//                     this.router.navigateByUrl('/session-timeout');
//                 }
//             }
//         )
//      }
// }


// rohith 

import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user/service/user.service';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { DocumentUploadComponent } from '../document-upload/document-upload.component';
import { OrganisationDetailsService } from './service/organisation-details.service';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-organisation-details',
    templateUrl: './organisation-details.component.html',
    styleUrls: ['./organisation-details.component.css'],
})
export class OrganisationDetailsComponent implements OnInit {
    @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>(); // Emit event after form submission
    @ViewChild(DocumentUploadComponent, { static: false }) documentUploadComponent?: DocumentUploadComponent;
    
    @Output() organisationId: EventEmitter<number> = new EventEmitter<number>();
    
    organisationForm: FormGroup;
    cityOptions: Array<{ name: string; district: string; state: string }> = [];
    loading = false;
    validationMessage = '';
    submitted = false;
    organisationUploadedDocs: { type: string; fileName: string ;multipartFile:Blob }[] = [];
    submissionAttempted: boolean = false;
  
    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        //private router: Router,
        private organisationDetailsService: OrganisationDetailsService,
        private userService: UserService,
        private router: Router
    ) {
        this.organisationForm = this.fb.group({
            organisationDetailsId:0,
            institutionName: ['',[Validators.required]],
            stdTelephone: ['',[Validators.required, Validators.pattern('^[0-9]{10}$')]],
            mobileNumber: ['',[Validators.required, Validators.pattern('^[0-9]{10}$')]],
            organisationEmail: ['',[Validators.required, Validators.pattern ('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
            address: ['',Validators.required],
            pincode: ['',[Validators.required, Validators.pattern('^[0-9]{6}$')]],
            city: [''],
            district: [''],
            state: [''],
            userMailId:['']
        });
    }
    userId: string = localStorage.getItem('email');

    async ngOnInit(): Promise<void> {
        await this.getCurrentLoggedInUserDetails();
        this.organisationForm.get('userMailId').setValue(this.userId);
        if (this.cityOptions.length > 1) {
            this.organisationForm.get('city')?.setValue(this.cityOptions[1].name);
        } else {
            this.clearCityAndState();
        }
    }
    preventSpecialChars(event: KeyboardEvent): void {
        const regex = /^[a-zA-Z0-9]+$/; // Only allows alphanumeric characters
        const key = event.key;
        if (!regex.test(key)) {
          event.preventDefault(); // Prevent the default behavior if the character is not allowed
        }
      }
      sanitizeInput(event: Event, controlName: string): void {
        const input = event.target as HTMLInputElement;
        input.value = input.value.replace(/[^0-9]/g, ''); // Allow only numbers
        // Update the specific FormControl value
        this.organisationForm.get(controlName)?.setValue(input.value, { emitEvent: false });
      }
      
      

    fetchCityState(pincode: string): void {
        this.loading = true;
        this.http.get(`https://api.postalpincode.in/pincode/${pincode}`).subscribe(
            (response: any) => {
                console.log('API Response:', response);
                this.loading = false;

                if (response[0]?.Status === 'Success') {
                    const places = response[0].PostOffice;

                    this.cityOptions = places.map((place: any) => ({
                        name: place.Name + ', ' + place.District,
                        district: place.District,
                        state: place.State,
                    }));

                    if (this.cityOptions.length > 0) {
                        this.organisationForm.patchValue({
                            city: this.cityOptions[0].name || '',
                            state: this.cityOptions[0].state || '',
                        });
                    } else {
                        this.clearCityAndState();
                    }
                } else {
                    this.clearCityAndState();
                }
            },
            (error) => {
                console.error('Error fetching pincode details:', error);
                this.loading = false;
                this.clearCityAndState();
                
            }
        );
    }

    clearCityAndState(): void {
        this.cityOptions = [];
        this.organisationForm.patchValue({
            city: '',
            state: '',
        });
    }

    onPincodeChange(): void {
        const pincode = this.organisationForm.get('pincode')?.value;
        if (pincode && /^\d{6}$/.test(pincode)) {
            this.fetchCityState(pincode);
        } else {
            
            this.clearCityAndState();
        }
    }

    handleOrganisationValidationChange(isValid: boolean): void {
        console.log('Validation status:', isValid);
    }

    setOrganisationUploadedDocuments(docs: any[]): void {
        this.organisationUploadedDocs = docs;
        console.log('Uploaded documents updated:', this.organisationUploadedDocs);
    }

    async handleSubmit(): Promise<void> {
        this.submitted = true;

        // if (this.documentUploadComponent) {
        //     this.documentUploadComponent.handleDocumentSubmit(); // Call child method
        //     this.organisationForm.markAllAsTouched;
        //     return;
        // }else {
        //     console.warn('DocumentUploadComponent not found!');
        // }

        if (this.organisationForm.invalid ||  this.documentUploadComponent.organisationUploadedDocs.length < 4) {
            this.organisationForm.markAllAsTouched();
            this.documentUploadComponent.submissionAttempted=true;
            // if (this.documentUploadComponent.uploadedDocs.length === 0) {
            this.documentUploadComponent.organisationInputFieldErrors = { message: 'No documents uploaded!', type: '' };
            // }
            this.documentUploadComponent.checkOrganisationValidation();
            console.error('Form validation failed. Details:');

            Object.keys(this.organisationForm.controls).forEach((controlName) => {
                const control = this.organisationForm.get(controlName);
                if (control?.invalid) {
                    console.error(
                        `Field "${controlName}" is invalid. Errors:`,
                        control.errors
                    );
                }
            });

            this.validationMessage = 'Please fill all required fields correctly.';
            return;
        }
        this.formSubmitted.emit();
        console.log('Form is valid and ready for submission.');

        const formData = {
            ...this.organisationForm.value,
        };
        this.documentUploadComponent.handleDocumentSubmit();
        // this.organisationDetailsService.saveOrganisationDetails(formData).subscribe(
        //     (response) => {
                
        //         console.log('Form submitted successfully', response);
        //         this.router.navigate(['/contact-details-form']);
        //     },
        //     (error) => {
        //         console.log(formData);
        //         console.error('Error submitting form', error);
        //     }
        // );
        this.organisationDetailsService.saveOrganisationDetails(formData).subscribe(
            (response: any) => {
                console.log('Form submitted successfully', response);

                this.updateOrganisationIdForUser(response.organisationDetailsId);
                localStorage.setItem('organisationId', response.organisationDetailsId);
                this.organisationId.emit(response.organisationDetailsId);

                const applicationId = response.applicationId; // Retrieve applicationId from the response
                console.log('Generated Application ID:', applicationId);
        
                if (applicationId) {
                    sessionStorage.setItem('applicationId', applicationId); // Save to sessionStorage
                    //this.router.navigate(['/contact-details-form']); // Navigate to Contact Details
                } else {
                    console.error('Application ID is null or undefined!');
                }
            },
            (error) => {
                console.error('Error submitting form', error);
            }
        );
    }
        // Method to check form validity (to be used in parent)
        isFormValid(): boolean {
        return this.organisationForm.valid;
     }
     user: any
    // userId: string = localStorage.getItem('email');
     async getCurrentLoggedInUserDetails(){
        console.log(this.userId)
        await lastValueFrom(this.userService.getUserByEmailId(this.userId)).then(
            response => {
                console.log(response);
                this.user = response.body;
            }
        )
     }

     async updateOrganisationIdForUser(organisationId: number){
        this.user.organisationId = organisationId;
        await lastValueFrom(this.userService.updateUser(this.user)).then(
            response => {
                if(response.status === HttpStatusCode.PartialContent){
                    console.log('org id updated for the user');
                }
            }, error => {
                if(error.status === HttpStatusCode.Unauthorized){
                    this.router.navigateByUrl('/session-timeout');
                }
            }
        )
     }
}


