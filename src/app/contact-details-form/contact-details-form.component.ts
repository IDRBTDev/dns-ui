import { Component, EventEmitter, Output, OnInit, OnChanges, SimpleChanges, Input, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactDetailsFormService } from './service/contact-details-form.service';
import { ActivatedRoute } from '@angular/router';
import { ContactDocumentUploadService } from '../contact-document-upload/service/contact-document-upload.service';
import { NotificationService } from '../notification/service/notification.service';
import { interval, Subscription } from 'rxjs';
import { DocumentUploadComponent } from '../document-upload/document-upload.component';

@Component({
  selector: 'app-contact-details-form',
  templateUrl: './contact-details-form.component.html',
  styleUrls: ['./contact-details-form.component.css']
})


export class ContactDetailsFormComponent implements OnInit, OnChanges {
  
  @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() back: EventEmitter<void> = new EventEmitter<void>(); // Emit event after form submission

  adminUploadedDocs:{type: string; filename:string,file:Blob}[]=[];
  techUploadedDocs:{type: string; filename:string,file:Blob}[]=[];
  billingUploadedDocs:{type: string; filename:string,file:Blob}[]=[];
 
  contactSubmissionAttempted: boolean = false;
  @Output()adminDocDetails : EventEmitter<any> = new EventEmitter<any>();
  @Output()techDocDetails : EventEmitter<any> = new EventEmitter<any>(); 
  @Output()billDocDetails : EventEmitter<any> = new EventEmitter<any>(); 

  @Input() organisationId: number =0;

  @Input() choosenContactType: string = '';

  @Input() choosenOrgId: number = 0;

  
  fullForm: FormGroup;
  applicationId: string | null = null; 
  user = ''; // Replace with appropriate value
  userMailId = localStorage.getItem('email');
  selectedDocType = '';
  imagUrl:any
  pdfUrl:any
  notificationList: any[] = [];
  notificationCount = 0;
  notificationError: string | null = null; // Holds error messages if any
  addressDetails: any;
  private notificationSubscription: Subscription;
    
      adminAddress: string = ''; 
      techAddress: string = ''; 
      billAddress: string = ''; 
      fullAddress: string = '';
  constructor(private fb: FormBuilder, private contactDetailsFormService: ContactDetailsFormService, private route: ActivatedRoute,
    private contactDoc:ContactDocumentUploadService,private notificationService: NotificationService,private cdr: ChangeDetectorRef) {
    this.fullForm = this.fb.group({
      // Admin Form Controls
      administrativeContactId: 0,
      adminFullName: ['', [Validators.required]],
      adminEmail: ['', [Validators.required, Validators.email]],
      adminPhone: ['', [Validators.required,Validators.minLength(10),Validators.pattern('^[0-9]*$')]],
      adminAltPhone: ['', [Validators.required,Validators.minLength(10),Validators.pattern('^[0-9]*$')]],
      adminDesignation: ['', [Validators.required]],
      adminAddress: [''], 

      // Technical Form Controls
      technicalContactId: 0,
      techFullName: ['', [Validators.required]],
      techEmail: ['', [Validators.required, Validators.email]],
      techPhone: ['', [Validators.required,Validators.minLength(10),Validators.pattern('^[0-9]*$')]],
      techAltPhone: ['', [Validators.required,Validators.minLength(10),Validators.pattern('^[0-9]*$')]],
      techDesignation: ['', [Validators.required]],
      techAddress: [''],

      // Billing Form Controls
      organisationalContactId: 0,
      billFullName: ['', [Validators.required]],
      billEmail: ['', [Validators.required, Validators.email]],
      billPhone: ['', [Validators.required,Validators.minLength(10),Validators.pattern('^[0-9]*$')]],
      billAltPhone: ['', [Validators.required,Validators.minLength(10),Validators.pattern('^[0-9]*$')]],
      billDesignation: ['', [Validators.required]],
      billAddress: [''],
    });
    }

  goBack(): void{
    console.log('goBack');
    this.back.emit();
  }

  resetForm() {
    // Reset form values and validation states
    this.fullForm.reset();
    Object.keys(this.fullForm.controls).forEach((field) => {
      const control = this.fullForm.get(field);
      if (control) {
        control.markAsUntouched();
        control.markAsPristine();
      }
      this.resetErrorMessages(); 
    });
    
  }
  @ViewChild(DocumentUploadComponent) documentUploadedForm: DocumentUploadComponent;

  // Method to reset the error messages in the DocumentUploadComponent
  resetErrorMessages() {
    if (this.documentUploadedForm) {
      this.documentUploadedForm.closedForm();
    }
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['organisationId']) {
      this.organisationId = changes['organisationId'].currentValue;
      console.log('organisationId changed:', changes['organisationId'].currentValue);
      // Add custom logic here for handling the updated data
    }
    this.setAddress();
    this.loadNotifications();
  }

  ngOnInit(): void {
    console.log(this.organisationId)
    this.setAddress();
    this.applicationId = sessionStorage.getItem('applicationId'); // Retrieve applicationId
    console.log('Retrieved Application ID from sessionStorage:', this.applicationId);
    this.loadNotifications();
    this.setupNotificationPolling();
  }
 
  setAddress(): void {
    this.addressDetails = JSON.parse(sessionStorage.getItem('addressDetails') || '{}');

    if (this.addressDetails && this.addressDetails.address) {
      // Concatenate the full address into one string
      this.fullAddress = `${this.addressDetails.address}, ${this.addressDetails.city}, ${this.addressDetails.state} - ${this.addressDetails.pincode}`;
      this.fullForm.patchValue({
        adminAddress: this.fullAddress,
        techAddress: this.fullAddress,
        billAddress: this.fullAddress,
      });

      this.cdr.detectChanges();

    }
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  private setupNotificationPolling(): void {
    this.notificationSubscription = interval(30000).subscribe(() => {
      this.loadNotifications();
    });
  }

  loadNotifications(): void {
    console.log(this.userMailId);
    if (this.userMailId) {
      this.notificationService.getNotifications(this.userMailId).subscribe(
        (notifications: any[]) => {
          this.notificationList = notifications; // Bind to the template
          this.notificationCount = notifications.filter(n => n.status === 'Unread').length; // Update count
          this.cdr.detectChanges(); // Ensure view updates
          console.log('Notifications loaded:', this.notificationList);
        },
        error => {
          this.notificationError = 'Error fetching notifications: ' + error.message;
          console.error('Error fetching notifications:', error);
        }
      );
    }
  }


  sanitizeInput(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.fullForm.get(controlName)?.setValue(input.value, { emitEvent: false });
  }

  handleTechValidationChange(isValid: boolean): void {
    console.log('Validation status:', isValid);
  }

  setTechUploadedDocuments(docs: any[]): void {
      this.techUploadedDocs = docs;
      console.log('Uploaded documents updated:', this.techUploadedDocs);
  }

  handleAdminValidationChange(isValid: boolean): void {
    console.log('Validation status:', isValid);
  }

  setAdminUploadedDocuments(docs: any[]): void {
    this.adminUploadedDocs = docs;
    console.log('Uploaded documents updated:', this.adminUploadedDocs);
  }

  handleBillingValidationChange(isValid: boolean): void {
    console.log('Validation status:', isValid);
  }

  setBillingUploadedDocuments(docs: any[]): void {
    this.billingUploadedDocs = docs;
    console.log('Uploaded documents updated:', this.billingUploadedDocs);
  }

 async onSubmitNewContact(choosenContactType: string){
  
    if(choosenContactType !== ''){
      if(choosenContactType === 'AdminOfficer'){
        const adminDetails = {
          adminFullName: this.fullForm.get('adminFullName')?.value,
          adminEmail: this.fullForm.get('adminEmail')?.value,
          adminPhone: this.fullForm.get('adminPhone')?.value,
          adminAltPhone: this.fullForm.get('adminAltPhone')?.value,
          adminDesignation: this.fullForm.get('adminDesignation')?.value,
          adminAddress: this.fullForm.value.adminAddress,
          addressLine1: this.addressDetails.address,
          city: this.addressDetails.city,
          state: this.addressDetails.state,
          pincode: this.addressDetails.pincode,
          // documents: this.fullForm.get('adminDocuments')?.value,

          applicationId: this.applicationId,
          organisationId: this.organisationId,
          isActive : false,
        };
        this.adminDocDetails.emit(this.adminUploadedDocs);
      //  setTimeout(() => {
      //   this.formSubmitted.emit();
      //  }, 0);
      // Save Admin details
      this.contactDetailsFormService.updateAdminDetails(adminDetails).subscribe(response => {
        console.log('Admin details saved successfully', response);
        console.log(adminDetails);
        // const applicationId = response.applicationId; // Ensure this is the correct field
        // sessionStorage.setItem('applicationId', applicationId);
        //console.log('Application ID saved to sessionStorage:', applicationId);
        console.log(adminDetails);
      }, error => {
        console.error('Error saving admin details', error);
      });
      }else if(choosenContactType === 'TechnicalOfficer'){
        const technicalDetails = {
          techFullName: this.fullForm.get('techFullName')?.value,
          techEmail: this.fullForm.get('techEmail')?.value,
          techPhone: this.fullForm.get('techPhone')?.value,
          techAltPhone: this.fullForm.get('techAltPhone')?.value,
          techDesignation: this.fullForm.get('techDesignation')?.value,
          addressLine1: this.addressDetails.address,
          city: this.addressDetails.city,
          state: this.addressDetails.state,
          pincode: this.addressDetails.pincode,
          // documents: this.fullForm.get('techDocuments')?.value,
          techAddress: this.fullForm.value.techAddress,
          applicationId: this.applicationId,
          organisationId: this.organisationId,
          isActive : false
        };
        setTimeout(() => {
          this.techDocDetails.emit(this.techUploadedDocs);
          console.log('Emitting tech docs:', this.techUploadedDocs);
        }, 0);
        // Save Technical details
      this.contactDetailsFormService.updateTechDetails(technicalDetails).subscribe(response => {
        console.log('Technical details saved successfully', response);
      }, error => {
        console.error('Error saving technical details', error);
      });
      }else{
        const billingDetails = {
          billFullName: this.fullForm.get('billFullName')?.value,
          billEmail: this.fullForm.get('billEmail')?.value,
          billPhone: this.fullForm.get('billPhone')?.value,
          billAltPhone: this.fullForm.get('billAltPhone')?.value,
          billDesignation: this.fullForm.get('billDesignation')?.value,
          billAddress: this.fullForm.value.billAddress,
          addressLine1: this.addressDetails.address,
          city: this.addressDetails.city,
          state: this.addressDetails.state,
          pincode: this.addressDetails.pincode,
          // documents: this.fullForm.get('billDocuments')?.value,
          applicationId: this.applicationId,
          organisationId: this.organisationId,
          isActive : false
        };
        setTimeout(() => {
          this.billDocDetails.emit(this.billingUploadedDocs);
         }, 0);
         // Save Billing details
      this.contactDetailsFormService.updateBillDetails(billingDetails).subscribe(response => {
        console.log('Billing details saved successfully', response);
      }, error => {
        console.error('Error saving billing details', error);
      });
      }
      
      const uploadedDoc=[...this.adminUploadedDocs,
  ...this.techUploadedDocs,
  ...this.billingUploadedDocs]
      
      
  this.contactDoc.uploadDocuments(uploadedDoc,this.applicationId,this.user,this.userMailId).subscribe({
        next:(response)=>{
          console.log(response)
        },error:(error)=>{
          console.log(error)
        }
      })
    }
  }
  @ViewChild(DocumentUploadComponent, { static: false }) documentUploadComponent?: DocumentUploadComponent;
  documentValidationPassed = false;
 validationMessage = '';
 ContactdocumentValidationStatus(isValid: boolean) {
      console.log('Validation status received from child:', isValid);
      this.documentValidationPassed = isValid;
    }

  async onSubmit(): Promise<void> {
    // this.documentUploadComponent.validateDocuments1();
    // console.log('Starting document validation...');
    // const isValid = await this.documentUploadComponent?.validateDocuments1();
    // console.log('Document Validation Result:', isValid);
  
    // if (!isValid) {
    //   this.validationMessage = 'One or more document file names are invalid!';
    //   console.error('One or more file names are invalid!');
    //   return;  // Prevent form submission if document validation fails
    // }
  

    this.onSubmitNewContact(this.choosenContactType)
    //if(this.adminUploadedDocs.length < )
  //  this.formSubmitted.emit();
    if (this.fullForm.valid && this.adminUploadedDocs.length>2 && this.techUploadedDocs.length>2 && this.billingUploadedDocs.length>2) {
      
      const adminDetails = {
        adminFullName: this.fullForm.get('adminFullName')?.value,
        adminEmail: this.fullForm.get('adminEmail')?.value,
        adminPhone: this.fullForm.get('adminPhone')?.value,
        adminAltPhone: this.fullForm.get('adminAltPhone')?.value,
        adminDesignation: this.fullForm.get('adminDesignation')?.value,
        // documents: this.fullForm.get('adminDocuments')?.value,
        adminAddress: this.fullForm.value.adminAddress,
        addressLine1: this.addressDetails.address,
        city: this.addressDetails.city,
        state: this.addressDetails.state,
        pincode: this.addressDetails.pincode,
        applicationId: this.applicationId,
        organisationId: this.organisationId,
        isActive : false
      };

      const technicalDetails = {
        techFullName: this.fullForm.get('techFullName')?.value,
        techEmail: this.fullForm.get('techEmail')?.value,
        techPhone: this.fullForm.get('techPhone')?.value,
        techAltPhone: this.fullForm.get('techAltPhone')?.value,
        techDesignation: this.fullForm.get('techDesignation')?.value,
        techAddress: this.fullForm.value.techAddress,
        addressLine1: this.addressDetails.address,
        city: this.addressDetails.city,
        state: this.addressDetails.state,
        pincode: this.addressDetails.pincode,
        // documents: this.fullForm.get('techDocuments')?.value,
        applicationId: this.applicationId,
        organisationId: this.organisationId,
        isActive : false
      };

      const billingDetails = {
        billFullName: this.fullForm.get('billFullName')?.value,
        billEmail: this.fullForm.get('billEmail')?.value,
        billPhone: this.fullForm.get('billPhone')?.value,
        billAltPhone: this.fullForm.get('billAltPhone')?.value,
        billDesignation: this.fullForm.get('billDesignation')?.value,
        billAddress: this.fullForm.value.billAddress,
        addressLine1: this.addressDetails.address,
        city: this.addressDetails.city,
        state: this.addressDetails.state,
        pincode: this.addressDetails.pincode,
        // documents: this.fullForm.get('billDocuments')?.value,
        applicationId: this.applicationId,
        organisationId: this.organisationId,
        isActive : false
      };

      //if(this.admin)
        this.adminDocDetails.emit(this.adminUploadedDocs);
        setTimeout(() => {
          this.techDocDetails.emit(this.techUploadedDocs);
        }, 0);
       setTimeout(() => {
        this.billDocDetails.emit(this.billingUploadedDocs);
       }, 0);
     
       setTimeout(() => {
        this.formSubmitted.emit();
       }, 0);
            // Emit event to notify parent that form was submitted successfully
           

      // Save Admin details
      this.contactDetailsFormService.updateAdminDetails(adminDetails).subscribe(response => {
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
      this.contactDetailsFormService.updateTechDetails(technicalDetails).subscribe(response => {
        console.log('Technical details saved successfully', response);
      }, error => {
        console.error('Error saving technical details', error);
      });

      // Save Billing details
      this.contactDetailsFormService.updateBillDetails(billingDetails).subscribe(response => {
        console.log('Billing details saved successfully', response);
      }, error => {
        console.error('Error saving billing details', error);
      });
      
      const uploadedDoc=[...this.adminUploadedDocs,
      ...this.techUploadedDocs,
      ...this.billingUploadedDocs]
      
      
      this.contactDoc.uploadDocuments(
        uploadedDoc,this.applicationId,
        this.user,this.userMailId)
      .subscribe({
        next:(response)=>{
          console.log(response)
        },error:(error)=>{
          console.log(error)
        }
      })

      const notification = {
        message: "Login details sent to billing and technical persons.",
        moduleType: "DocumentUpload", 
        moduleRecordId: 102,
        notificationTo: this.fullForm.get('adminEmail')?.value, 
        emailId: this.fullForm.get('adminEmail')?.value, 
        status: "Unread", 
        createdDateTime: new Date().toISOString(), 
        createdByEmailId: this.userMailId, 
        profilepic: null 
      };
      
   
      if (!notification.notificationTo || !notification.emailId) {
        console.error('Error: Notification creation failed because the email is missing or invalid.');
        return;
      }
      
     
      this.notificationService.createNotification(notification).subscribe(
        (response) => {
          console.log('Notification created successfully:', response);
          this.loadNotifications(); 
        },
        (error) => {
          console.error('Error creating notification:', error);
        }
      );
      
      
    } 

    else {
      this.contactSubmissionAttempted=true;
      console.log('Form is invalid');
      this.fullForm.markAllAsTouched(); 
    }
  }
  onImageViewClick(imageUrl) {
    console.log(imageUrl)
    this.pdfUrl = null
    this.imagUrl = imageUrl
  }
  onPdfViewClick(pdfUrl) {
    this.imagUrl = null
    this.pdfUrl = pdfUrl
  }
 
}

