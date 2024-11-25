import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactDetailsFormService } from './service/contact-details-form.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact-details-form',
  templateUrl: './contact-details-form.component.html',
  styleUrls: ['./contact-details-form.component.css']
})
export class ContactDetailsFormComponent implements OnInit {
  @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() back: EventEmitter<void> = new EventEmitter<void>(); // Emit event after form submission

  fullForm: FormGroup;
  applicationId: string | null = null; 

  constructor(private fb: FormBuilder, private contactDetailsFormService: ContactDetailsFormService, private route: ActivatedRoute) {}

  goBack(): void{
    console.log('goBack');
    this.back.emit();
  }

  ngOnInit(): void {
    this.fullForm = this.fb.group({
      // Admin Form Controls
      adminFullName: ['', [Validators.required]],
      adminEmail: ['', [Validators.required, Validators.email]],
      adminPhone: ['', [Validators.required,Validators.minLength(10),Validators.pattern('^[0-9]*$')]],
      adminAltPhone: ['', [Validators.required,Validators.minLength(10),Validators.pattern('^[0-9]*$')]],
      adminDesignation: ['', [Validators.required]],
      adminDocuments: ['', [Validators.required]],

      // Technical Form Controls
      techFullName: ['', [Validators.required]],
      techEmail: ['', [Validators.required, Validators.email]],
      techPhone: ['', [Validators.required,Validators.minLength(10),Validators.pattern('^[0-9]*$')]],
      techAltPhone: ['', [Validators.required,Validators.minLength(10),Validators.pattern('^[0-9]*$')]],
      techDesignation: ['', [Validators.required]],
      techDocuments: ['', [Validators.required]],

      // Billing Form Controls
      billFullName: ['', [Validators.required]],
      billEmail: ['', [Validators.required, Validators.email]],
      billPhone: ['', [Validators.required,Validators.minLength(10),Validators.pattern('^[0-9]*$')]],
      billAltPhone: ['', [Validators.required,Validators.minLength(10),Validators.pattern('^[0-9]*$')]],
      billDesignation: ['', [Validators.required]],
      billDocuments: ['', [Validators.required]],
    });
    // Retrieve applicationId from sessionStorage
    this.applicationId = sessionStorage.getItem('applicationId'); // Retrieve applicationId
    console.log('Retrieved Application ID from sessionStorage:', this.applicationId);
  }

  onSubmit(): void {

  //  this.formSubmitted.emit();
    if (this.fullForm.valid) {
      
      const adminDetails = {
        fullName: this.fullForm.get('adminFullName')?.value,
        email: this.fullForm.get('adminEmail')?.value,
        phone: this.fullForm.get('adminPhone')?.value,
        altPhone: this.fullForm.get('adminAltPhone')?.value,
        designation: this.fullForm.get('adminDesignation')?.value,
        documents: this.fullForm.get('adminDocuments')?.value,
        applicationId: this.applicationId,
      };

      const technicalDetails = {
        fullName: this.fullForm.get('techFullName')?.value,
        email: this.fullForm.get('techEmail')?.value,
        phone: this.fullForm.get('techPhone')?.value,
        altPhone: this.fullForm.get('techAltPhone')?.value,
        designation: this.fullForm.get('techDesignation')?.value,
        documents: this.fullForm.get('techDocuments')?.value,
        applicationId: this.applicationId
      };

      const billingDetails = {
        fullName: this.fullForm.get('billFullName')?.value,
        email: this.fullForm.get('billEmail')?.value,
        phone: this.fullForm.get('billPhone')?.value,
        altPhone: this.fullForm.get('billAltPhone')?.value,
        designation: this.fullForm.get('billDesignation')?.value,
        documents: this.fullForm.get('billDocuments')?.value,
        applicationId: this.applicationId
      };
      // Emit event to notify parent that form was submitted successfully
      

      // Save Admin details
      this.contactDetailsFormService.saveAdminDetails(adminDetails).subscribe(response => {
        console.log('Admin details saved successfully', response);
        console.log(adminDetails);
        // const applicationId = response.applicationId; // Ensure this is the correct field
        // sessionStorage.setItem('applicationId', applicationId);
        //console.log('Application ID saved to sessionStorage:', applicationId);
        console.log(adminDetails);
      }, error => {
        console.error('Error saving admin details', error);
      });

      // Save Technical details
      this.contactDetailsFormService.saveTechDetails(technicalDetails).subscribe(response => {
        console.log('Technical details saved successfully', response);
      }, error => {
        console.error('Error saving technical details', error);
      });

      // Save Billing details
      this.contactDetailsFormService.saveBillDetails(billingDetails).subscribe(response => {
        console.log('Billing details saved successfully', response);
      }, error => {
        console.error('Error saving billing details', error);
      });

      // Emit event to notify parent that form was submitted successfully
      this.formSubmitted.emit();
    } 
    else {
      console.log('Form is invalid');
      this.fullForm.markAllAsTouched(); // Mark all fields as touched to trigger validation
    }
  }
 
}