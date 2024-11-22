// src/app/user-domain-details/user-domain-details.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDomainService } from './service/user-domain.service';  // Import the service from the new folder
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-domain-details',
  templateUrl: './user-domain-details.component.html',
  styleUrls: ['./user-domain-details.component.css']
})
export class UserDomainDetailsComponent {
  userDomainForm: FormGroup;
  showResult = false;

  constructor(
    private fb: FormBuilder,
    private userDomainService: UserDomainService,  // Inject the service here
    public router:Router
  ) {
    this.userDomainForm = this.fb.group({
      bankName: ['', [Validators.required, Validators.minLength(3)]],
      domain: ['', Validators.required],
      term:5,
      cost:5900
    });
  }
  onSearch() {
    if (this.userDomainForm.valid) {
      // Show the search result if the form is valid
      this.showResult = true;
      console.log('Form is valid, showing results');
      // You can also add further logic for making an API call or searching
    } else {
      this.userDomainForm.markAllAsTouched(); 
      console.log('Form is invalid');
    }
  }
  // Handle form submission
  onSubmit() {
    if (this.userDomainForm.valid) {
      this.showResult = true;  // Show result after submission
      const domainData = this.userDomainForm.value;
      console.log(domainData)
      this.router.navigate(['/onboarding-stepper']);

      // Call the service to send domain data
      this.userDomainService.sendDomainData(domainData).subscribe(
        (response) => {
          console.log('Domain data submitted successfully', response);
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
}