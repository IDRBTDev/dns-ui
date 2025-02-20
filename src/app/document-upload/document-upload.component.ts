import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DocumentUploadService } from './service/document-upload.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../user/service/user.service';
import { HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css'],
})
export class DocumentUploadComponent implements OnInit {


  maxFileSizeInMB: number = environment.maxFileSizeMB;
  @Input() mode: string = ''; // Default to 'organisation'
  @Input() submissionAttempted = false;
  @Input()preview:string=''
  @Input() contactSubmissionAttempted= false;

  @Output() onOrganisationValidationChange = new EventEmitter<boolean>();
  @Output() onAdminValidationChange = new EventEmitter<boolean>();

  @Output() onTechValidationChange = new EventEmitter<boolean>();
  @Output() onBillingValidationChange = new EventEmitter<boolean>();
  @Output() imageUrl = new EventEmitter<any>();
  @Output() pdfUrl = new EventEmitter<any>();
  @Output() imagePreviewUrl = new EventEmitter<any>();
  @Output() pdfPreviewUrl = new EventEmitter<any>();
  @Input() organisationUploadedDocs: any[] = [];
  @Input() adminUploadedDocs: any[] = [];
  @Input() billingUploadedDocs: any[] = [];
  @Input() techUploadedDocs: any[] = [];

  @Output() setOrganisationUploadedDocs = new EventEmitter<any[]>();
  @Output() setAdminUploadedDocs = new EventEmitter<any[]>();

  @Output() setTechUploadedDocs = new EventEmitter<any[]>();
  @Output() setBillingUploadedDocs = new EventEmitter<any[]>();

  @Input() organisationId: number = 0;

  // Organisation Section
  organisationRequiredDocs: string[] = [
    'Organisation GSTIN',
    'PAN',
    'License No',
    'Board Resolution',
  ];
   // Administrative Section
   adminRequiredDocs: string[] = ['Aadhaar', 'PAN', 'Organisation Id'];

   // Technical Section
   techRequiredDocs: string[] = ['Aadhaar', 'PAN', 'Organisation Id'];
 
   // Billing Section
   billingRequiredDocs: string[] = ['Aadhaar', 'PAN', 'Organisation Id'];

   // Errors
  organisationErrors = { message: '', type: '' };
  adminErrors = { message: '', type: '' };
  techErrors = { message: '', type: '' };
  billingErrors = { message: '', type: '' };

  // Input Field Errors
  organisationInputFieldErrors = { message: '', type: '' };
  adminInputFieldErrors = { message: '', type: '' };
  techInputFieldErrors = { message: '', type: '' };
  billingInputFieldErrors = { message: '', type: '' };

  // Selected Document Types
  organisationSelectedDocType = '';
  adminSelectedDocType = '';
  techSelectedDocType = '';
  billingSelectedDocType = '';

  // Input Values
  organisationInputValue = '';
  adminInputValue = '';
  techInputValue = '';
  billingInputValue = '';

  applicationId = ''; // Replace with appropriate value
  user = ''; // Replace with appropriate value
  userMailId = localStorage.getItem('email');
  
  constructor(private documentUploadService: DocumentUploadService,private sanitizer: DomSanitizer,private fb: FormBuilder,private userService:UserService
    ,private router :Router
  ) {
    this.organisationErrors = { message: '', type: '' };
    this.techInputFieldErrors = { message: '', type: '' };
    this.techErrors = { message: '', type: '' };
    this.organisationInputFieldErrors={ message: '', type: '' };
   
  }
  documentUploadedForm: FormGroup;
 
  ngOnInit(): void {
    this.techErrors = { message: '', type: '' };
    this.checkOrganisationValidation();
    this.checkAdminValidation();
    this.checkTechValidation();
    this.checkBillingValidation();
    this.getloggedInUser();
  }
  ngOnChanges(): void {
    this.checkOrganisationValidation();
    this.checkAdminValidation();
    this.checkTechValidation();
    this.checkBillingValidation();
  }


  // clearErrorsIfLicenseNo() {
  //   if (this.organisationSelectedDocType === 'License No') {
  //     this.organisationInputFieldErrors = { message: '', type: '' };
  //   }
  // }
  getloggedInUser():any{
      this.userService.getUserByEmailId(this.userMailId).subscribe({
        next:(response)=>{
          console.log(response)
          this.user= response.body.userName;
           
        },error:(error)=>{
          if(error.status===HttpStatusCode.Unauthorized){
            this.navigateToSessionTimeout();
          }
        }
      })
    }
    navigateToSessionTimeout(){
      this.router.navigateByUrl("session-timeout");
    }
  handleOrganisationFileChange(event: any): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }
    
    this.organisationSelectedDocType = localStorage.getItem('orgdoctype');
    this.organisationInputValue = localStorage.getItem('orgInputValue');

    // Clear any existing errors before setting new ones
    this.organisationErrors = { type: '', message: '' };

    const docTypeExists = this.organisationUploadedDocs.some(
      (doc) => doc.type === this.organisationSelectedDocType
    );

    if (docTypeExists) {
      this.organisationErrors = {
        type: 'fileUpload',
        message: `A document of type "${this.organisationSelectedDocType}" is already uploaded. Please choose a different type.`,
      };
      input.value = ''; // Reset file input
      return;
    }

    const file = input.files[0]; // Assuming single file upload
    const fileExists = this.organisationUploadedDocs.some(
      (doc) => doc.fileName === file.name && doc.fileSize === file.size
    );

    if (fileExists) {
      this.organisationErrors = {
        type: 'fileUpload',
        message: 'This file is already uploaded. Please choose a different file.',
      };
      input.value = ''; // Reset the file input
      return;
    }

    const validFileTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
    if (!validFileTypes.includes(file.type)) {
      this.organisationErrors = {
        type: 'fileUpload',
        message: 'Invalid file type. Only PDF, JPG, and JPEG are allowed.',
      };
      input.value = ''; // Reset the file input field
      return;
    }

    const maxFileSize = this.maxFileSizeInMB * 1024 * 1024;  // Convert MB to bytes
    if (file.size > maxFileSize) {
      this.organisationErrors = {
        type: 'fileUpload',
        message: `Select a file less than ${this.maxFileSizeInMB}MB.`,
      };
      input.value = ''; // Reset file input
      return;
    }

    const uploadedDoc = {
      type: this.organisationSelectedDocType,
      fileName: file.name,
      fileSize: file.size, // Optional for extra checks
      value: this.organisationInputValue || null,
      organisationId: this.organisationId,
      file: event.target.files[0],
      contactType: 'Organisation'
    };
    
    this.organisationUploadedDocs.push(uploadedDoc);

    // Clear any previous error messages
    this.organisationErrors = { message: '', type: '' };
    this.organisationInputFieldErrors = { message: '', type: '' };

    input.value = ''; // Reset file input
}


  handleAdminFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }
    this.adminSelectedDocType=localStorage.getItem('Admindoctype');
    this.adminInputValue=localStorage.getItem('adminInputValue');
    console.log(this.adminUploadedDocs,this.adminSelectedDocType)
    const docTypeExists = this.adminUploadedDocs.some(
      (doc) => doc.type === this.adminSelectedDocType
    );

    if (docTypeExists) {
      this.adminErrors = {
        type: 'fileUpload',
        message: `A document of type "${this.adminSelectedDocType}" is already uploaded. Please choose a different type.`,
      };
      input.value = ''; // Reset file input
      return;
    }
    

    const file = input.files[0]; // Assuming single file upload
    console.log(file)
    const fileExists = this.adminUploadedDocs.some(
      (doc) => doc.fileName === file.name && doc.fileSize === file.size
    );
    if (fileExists) {
      console.log(fileExists)
      this.adminErrors = {
        type: 'fileUpload',
        message:
          'This file is already uploaded. Please choose a different file.',
      };
      return;
    }


    console.log(this.adminInputValue)

    const validFileTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validFileTypes.includes(file.type)) {
      this.adminErrors = {
        type: 'fileUpload',
        message: 'Invalid file type. Only PDF, PNG, JPG, and JPEG are allowed.',
      };
      input.value = ''; // Reset the file input field
      return;
    }
    const maxFileSize = this.maxFileSizeInMB * 1024 * 1024;  // Convert MB to bytes
    if (file.size > maxFileSize) {
      this.adminErrors = {
        type: 'fileUpload',
        message: `Select a file less than ${this.maxFileSizeInMB}MB `,
      };
      input.value = ''; // Reset file input
      return;
    }

    const uploadedDoc = {
      type: this.adminSelectedDocType,
      fileName: file.name,
      fileSize: file.size, // Optional for extra checks
      value: this.adminInputValue ,
      organisationId: this.organisationId,
      contactType:'Administrative',
      file:file
    };
    console.log(uploadedDoc)
    this.adminUploadedDocs.push(uploadedDoc);

    this.adminErrors = { message: '', type: '' };
    this.adminInputFieldErrors = { message: '', type: '' };
    //this.clearErrors();
    input.value = ''; // Resetadmin
    //this.handleFileUpload(event, this.adminDocs, this.adminErrors, 'Administrative');
  }

  handleTechFileChange(event: any): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }
    this.techSelectedDocType=localStorage.getItem('techdoctype');
    this.techInputValue=localStorage.getItem('techInputValue');
    const docTypeExists = this.techUploadedDocs.some(
      (doc) => doc.type === this.techSelectedDocType
    );

    if (docTypeExists) {
      this.techErrors = {
        type: 'fileUpload',
        message: `A document of type "${this.techSelectedDocType}" is already uploaded. Please choose a different type.`,
      };
      input.value = ''; // Reset file input
      return;
    }
    const file = input.files[0]; // Assuming single file upload
    const fileExists = this.techUploadedDocs.some(
      (doc) => doc.fileName === file.name && doc.fileSize === file.size
    );
    if (fileExists) {
      this.techErrors = {
        type: 'fileUpload',
        message:
          'This file is already uploaded. Please choose a different file.',
      };
      return;
    }
    const validFileTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validFileTypes.includes(file.type)) {
      this.techErrors = {
        type: 'fileUpload',
        message: 'Invalid file type. Only PDF, PNG, JPG, and JPEG are allowed.',
      };
      input.value = ''; // Reset the file input field
      return;
    }
    this.techErrors = { type: '', message: '' };
    const maxFileSize = this.maxFileSizeInMB * 1024 * 1024; 
    if (file.size > maxFileSize) {
      this.techErrors = {
        type: 'fileUpload',
        message: `Select a file less than  ${this.maxFileSizeInMB}MB`,
      };
      input.value = ''; // Reset file input
      return;
    }
    const uploadedDoc = {
      type: this.techSelectedDocType,
      fileName: file.name,
      fileSize: file.size, // Optional for extra checks
      value: this.techInputValue || null,
      organisationId: this.organisationId,
      file:file,
      contactType: 'Technical'
    };

    this.techUploadedDocs.push(uploadedDoc);

    this.techErrors = { message: '', type: '' };
    this.techInputFieldErrors = { message: '', type: '' };
    //this.clearErrors();
    input.value = ''; // Reset file input

    //this.handleFileUpload(event, this.techDocs, this.techErrors, 'Technical');
  }

  handleBillingFileChange(event: any): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }
    console.log(this.billingErrors)
    this.billingErrors= JSON.parse(localStorage.getItem('billingErrors'))
    this.billingInputFieldErrors=JSON.parse(localStorage.getItem('billingInputFieldErrors'))
    this.billingSelectedDocType=localStorage.getItem('billdoctype');
    this.billingInputValue=localStorage.getItem('billInputValue');
    
    const docTypeExists = this.billingUploadedDocs.some(
      (doc) => doc.type === this.billingSelectedDocType
    );

    if (docTypeExists) {
      this.billingErrors = {
        type: 'fileUpload',
        message: `A document of type "${this.billingSelectedDocType}" is already uploaded. Please choose a different type.`,
      };
      input.value = ''; // Reset file input
      return;
    }
    const file = input.files[0]; // Assuming single file upload
    const fileExists = this.billingUploadedDocs.some(
      (doc) => doc.fileName === file.name && doc.fileSize === file.size
    );
    if (fileExists) {
      this.billingErrors = {
        type: 'fileUpload',
        message:
          'This file is already uploaded. Please choose a different file.',
      };
      return;
    }
    const validFileTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validFileTypes.includes(file.type)) {
      this.billingErrors = {
        type: 'fileUpload',
        message: 'Invalid file type. Only PDF, PNG, JPG, and JPEG are allowed.',
      };
      input.value = ''; // Reset the file input field
      return;
    }
    const maxFileSize = this.maxFileSizeInMB * 1024 * 1024; 
    if (file.size > maxFileSize) {
      this.billingErrors = {
        type: 'fileUpload',
        message: `The file size exceeds the ${this.maxFileSizeInMB}MB limit. Please choose a smaller file.`,
      };
      input.value = ''; // Reset file input
      return;
    }
    const uploadedDoc = {
      type: this.billingSelectedDocType,
      fileName: file.name,
      fileSize: file.size, // Optional for extra checks
      value: this.billingInputValue || null,
      organisationId: this.organisationId,
      file:file,
      contactType: 'Billing'
    };

    this.billingUploadedDocs.push(uploadedDoc);

    this.billingErrors = { message: '', type: '' };
    this.billingInputFieldErrors = { message: '', type: '' };
    //this.clearErrors();
    input.value = ''; // Reset file input

    //this.handleFileUpload(event, this.billingDocs, this.billingErrors, 'Billing');
  }

  // Common method to handle file uploads

  // get missingOrganisationDocs(): string[] {
  //   return this.organisationRequiredDocs.filter(
  //     (doc) => !this.isOrganisationDocUploaded(doc)
  //   );
  // }
  uploadedDocs: string[] = [];

  get missingOrganisationDocs(): string[] {
    // This filters out the missing documents based on your existing logic
    return this.organisationRequiredDocs.filter(doc => !this.isOrganisationDocUploaded(doc));
  }
  
  set missingOrganisationDocs(value: string[]) {
    // If you need to reset or modify the missing docs from outside, you can set it like this
    this.organisationRequiredDocs = value;  // Reset organisationRequiredDocs
  }

  get missingAdminDocs():string[]{
    return this.adminRequiredDocs.filter(doc => !this.isAdminDocUploaded(doc));
  }
set missingAdminDocs(value:string[]){
  this.adminRequiredDocs=value;
}

  // get missingAdminDocs(): string[] {
  //   return this.adminRequiredDocs.filter(
  //     (doc) => !this.isAdminDocUploaded(doc)
  //   );
  // }
  get missingBillingDocs(): string[] {
    return this.billingRequiredDocs.filter(
      (doc) => !this.isBillingDocUploaded(doc)
    );
  }
  get missingTechDocs(): string[] {
    return this.techRequiredDocs.filter((doc) => !this.isTechDocUploaded(doc));
  }

  // Handle remove document for each section
  handleRemoveOrganisationDoc(index: number): void {
    this.submissionAttempted = false;
    this.organisationUploadedDocs.splice(index, 1);
    this.setOrganisationUploadedDocs.emit(this.organisationUploadedDocs);
  }

  handleRemoveAdminDoc(index: number): void {
    this.submissionAttempted = false;
    this.adminUploadedDocs.splice(index, 1);
    this.setAdminUploadedDocs.emit(this.adminUploadedDocs);
  }

  handleRemoveTechDoc(index: number): void {
    this.submissionAttempted = false;
    this.techUploadedDocs.splice(index, 1);
    this.setTechUploadedDocs.emit(this.techUploadedDocs);
  }

  handleRemoveBillingDoc(index: number): void {
    this.submissionAttempted = false;
    this.billingUploadedDocs.splice(index, 1);
    this.setBillingUploadedDocs.emit(this.billingUploadedDocs);
  }

  // Check validation based on uploaded documents
  //   checkValidation(): void {
  //     const allDocs = [
  //       ...this.organisationUploadedDocs,
  //       ...this.adminDocs,
  //       ...this.techDocs,
  //       ...this.billingDocs,
  //     ];

  //     this.missingDocs = this.requiredDocs.filter(doc => !allDocs.some(uploadedDoc => uploadedDoc.type === doc));
  //     const isValid = allDocs.length >= this.requiredDocs.length;
  //     this.onValidationChange.emit(isValid);
  //   }
  checkOrganisationValidation(): void {
    const isValid = this.organisationUploadedDocs.length >= 4;
    this.onOrganisationValidationChange.emit(isValid);
  }
  checkAdminValidation(): void {
    console.log("adminValid")
    const isValid = this.adminUploadedDocs.length >= 3;
    console.log(isValid)
    this.onAdminValidationChange.emit(isValid);
  }
  checkTechValidation(): void {
    const isValid = this.techUploadedDocs.length >= 3;
    this.onTechValidationChange.emit(isValid);
  }
  checkBillingValidation(): void {
    const isValid = this.billingUploadedDocs.length >= 3;
    this.onBillingValidationChange.emit(isValid);
  }

  // Handle submit button
  handleDocumentSubmit(organisationId): void {
    this.submissionAttempted = true;
    const allDocs = [
      ...this.organisationUploadedDocs,
      ...this.adminUploadedDocs,
      ...this.techUploadedDocs,
      ...this.billingUploadedDocs,
    ];

    if (allDocs.length === 0) {
      this.organisationErrors.message = 'No documents uploaded!';
      return;
    }
    this.applicationId=sessionStorage.getItem('applicationId');
  console.log(allDocs, this.applicationId, this.user, this.userMailId)
    this.documentUploadService
      .uploadDocuments(allDocs, this.applicationId, this.user, this.userMailId, organisationId)
      .subscribe({
        next: (res) => console.log('Upload successful:', res),
        error: (err) => console.error('Error uploading documents:', err),
      });
  }

  // Check if a document is uploaded for each section
  isOrganisationDocUploaded(docType: string): boolean {
    return this.organisationUploadedDocs.some((doc) => doc.type === docType);
  }

  isAdminDocUploaded(docType: string): boolean {
    return this.adminUploadedDocs.some((doc) => doc.type === docType);
  }

  isTechDocUploaded(docType: string): boolean {
    return this.techUploadedDocs.some((doc) => doc.type === docType);
  }

  isBillingDocUploaded(docType: string): boolean {
    return this.billingUploadedDocs.some((doc) => doc.type === docType);
  }

  // Handle input changes for each section
  handleOrganisationDocTypeChange(event: any): void {
    const target = event.target as HTMLSelectElement;
    this.organisationSelectedDocType = target.value;

    this.organisationInputValue =null
    this.organisationInputFieldErrors = { message: '', type: '' };
  }

  handleAdminDocTypeChange(event: any): void {
    const target = event.target as HTMLSelectElement;
    this.adminSelectedDocType = target.value;
    this.adminInputValue =null;
    this.adminInputFieldErrors = { message: '', type: '' };
  }

  handleTechDocTypeChange(event: any): void {
    const target = event.target as HTMLSelectElement;
    this.techSelectedDocType = target.value;
    this.techInputValue = null;
    this.techInputFieldErrors = { message: '', type: '' };  

  }
 
  closedForm() {
    console.log('Resetting all fields and error messages...');
    this.submissionAttempted = false; 
  this.contactSubmissionAttempted=false;
    // Organisation section reset
    this.organisationSelectedDocType = '';
    this.organisationInputValue = '';
    this.organisationErrors = { message: '', type: '' };
    this.organisationInputFieldErrors = { message: '', type: '' };
    this.missingOrganisationDocs = [];
  

    // Admin section reset
    this.adminSelectedDocType = '';
    this.adminInputValue = '';
    this.adminErrors = { message: '', type: '' };
    this.adminInputFieldErrors = { message: '', type: '' };

    this.techErrors = { message: '', type: '' };
    this.techInputFieldErrors = { message: '', type: '' };
    this.techSelectedDocType = '';
    this.techInputValue = '';


    this.billingErrors = { message: '', type: '' };
    this.billingInputFieldErrors = { message: '', type: '' };
    this.billingSelectedDocType = '';
    this.billingInputValue = '';


    console.log('All fields and errors have been reset.');
  }
  
  handleBillingDocTypeChange(event: any): void {
    const target = event.target as HTMLSelectElement;
    this.billingSelectedDocType = target.value;
    this.billingInputValue = null;
    this.billingInputFieldErrors = { message: '', type: '' };
   
    
  }

  // Handle input value changes for each section
  handleOrganisationInputChange(event: any): void {
    const inputValue = event.trim();
    if (/^[a-zA-Z0-9\s]*$/.test(event)) {
      this.organisationInputValue = event;
      if(!inputValue){
        this.organisationInputFieldErrors = { message: '', type: '' };
        return;
      }
      if (this.organisationSelectedDocType === 'PAN') {
        const isValidPAN = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(event);
        this.organisationInputFieldErrors = isValidPAN
          ? { message: '', type: '' }
          : { message: 'Invalid PAN format.', type: 'organisationInputValue' };
      }
       else if (/^[a-zA-Z0-9\s]*$/.test(event)) {
        this.organisationInputValue = event;
        if (this.organisationSelectedDocType === 'Organisation GSTIN') {
          const isValidOrgGST = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]$/.test(event);
          this.organisationInputFieldErrors = isValidOrgGST
            ? { message: '', type: '' }
            : {
                message: 'Invalid Organization GSTIN format.',
                type: 'organisationInputValue',
              };
        }
      else if (/^[a-zA-Z0-9\s]*$/.test(event)) {
        this.organisationInputValue = event;
        if(this.organisationSelectedDocType === 'License No'){
          const isValidLicenceNum = /^[LU]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(event);;
          this.organisationInputFieldErrors = isValidLicenceNum
          ? { message: '', type: '' }
          : {
              message: 'Invalid Licence Number format.',
              type: 'organisationInputValue',
            };
        }
      }
     } else {
        this.organisationInputFieldErrors = { message: '', type: '' };
      }
    }

    //this.organisationInputFieldErrors.message = '';
  }
  getMaxLength(): number | null {
    switch (this.organisationSelectedDocType) {
      case 'Organisation GSTIN':
        return 15;
      case 'PAN':
        return 10;
      case 'License No': // CIN
        return 21;
      default:
        return null; // Or a default max length if needed
    }
  }
  filterInputValue:string='';
 
  handleAdminInputChange(event: any): void {
    this.adminInputFieldErrors = { message: '', type: '' };
    const inputValue1 = event.trim();
    // Get the raw input value from the event
    let inputValue = event;
    if(!inputValue1){
      this.adminInputFieldErrors = { message: '', type: '' };
      return;
    }
    // Step 1: Handle PAN validation
    if (this.adminSelectedDocType === 'PAN') {
      // Allow only alphanumeric characters for PAN
      let sanitizedInput = inputValue.replace(/[^A-Z0-9]/g, ''); // Remove special characters
      this.adminInputValue = sanitizedInput;
  
      // Validate PAN format: 5 letters + 4 digits + 1 letter
      const isValidPAN = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(sanitizedInput);
  
      this.adminInputFieldErrors = isValidPAN
        ? { message: '', type: '' }
        : { message: 'Invalid PAN format.', type: 'adminInputValue' };
    }
  
    // Step 2: Handle Aadhaar validation with space after every 4 digits
    else if (this.adminSelectedDocType === 'Aadhaar') {
      // Allow only numeric input for Aadhaar (reject any non-digit characters)
      let sanitizedAadhaarInput = inputValue.replace(/[^0-9]/g, '');
  
      // If the input value is longer than 12 digits, truncate it
      sanitizedAadhaarInput = sanitizedAadhaarInput.slice(0, 12);
  
      // Add space after every 4 digits for Aadhaar formatting
      let formattedAadhaar = sanitizedAadhaarInput.replace(/(\d{4})(?=\d)/g, '$1 ');
  
      // Update the input value with formatted Aadhaar number
      this.adminInputValue = formattedAadhaar;
  
      // Validate Aadhaar format: must be exactly 12 digits (without spaces)
      const isValidAadhaar = /^[0-9]{12}$/.test(sanitizedAadhaarInput);
  
      this.adminInputFieldErrors = isValidAadhaar
        ? { message: '', type: '' }
        : { message: 'Invalid Aadhaar format.', type: 'adminInputValue' };
    }
    else{
      this.adminInputFieldErrors = { message:'', type:''}
    }
  }
  
  // Add a `keydown` event handler to block non-numeric characters for Aadhaar
  onKeyDown(event: KeyboardEvent): void {
    if (this.adminSelectedDocType === 'PAN' || this.techSelectedDocType === 'PAN' || this.billingSelectedDocType === 'PAN') {
      const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
      // Allow alphanumeric characters for PAN and certain special keys
      if (!/[A-Z0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
        event.preventDefault();  // Prevent non-alphanumeric input
      }
    }
  
    if (this.adminSelectedDocType === 'Aadhaar' || this.techSelectedDocType === 'Aadhaar' || this.billingSelectedDocType === 'Aadhaar') {
      const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
      // Allow only numeric characters for Aadhaar and certain special keys
      if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
        event.preventDefault();  // Prevent non-numeric input
      }
    }
  }
  
  

  handleTechInputChange(event: any): void {
    this.techInputFieldErrors = { message: '', type: '' };
    let inputValue1=event.trim();
    if(!inputValue1){
      this.techInputFieldErrors ={message:'', type:''}
      return;
    }
    let inputValue = event;
   
  
    // Step 2: Handle PAN validation
    if (this.techSelectedDocType === 'PAN') {
      let sanitizedInput = inputValue.replace(/[^A-Z0-9]/g, ''); // Remove special characters
      this.techInputValue = sanitizedInput;
  
      // Validate PAN format: 5 letters + 4 digits + 1 letter
      const isValidPAN = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(sanitizedInput);
  
      this.techInputFieldErrors = isValidPAN
        ? { message: '', type: '' }
        : { message: 'Invalid PAN format.', type: 'techInputValue' };
    }
    
    // Step 3: Handle Aadhaar validation and formatting with space after every 4 digits
    else if (this.techSelectedDocType === 'Aadhaar') {
      let sanitizedAadhaarInput = inputValue.replace(/[^0-9]/g, '');
  
      // If the input value is longer than 12 digits, truncate it
      sanitizedAadhaarInput = sanitizedAadhaarInput.slice(0, 12);
  
      // Add space after every 4 digits for Aadhaar formatting
      let formattedAadhaar = sanitizedAadhaarInput.replace(/(\d{4})(?=\d)/g, '$1 ');
  
      // Update the input value with formatted Aadhaar number
      this.techInputValue = formattedAadhaar;
  
      // Validate Aadhaar format: must be exactly 12 digits (without spaces)
      const isValidAadhaar = /^[0-9]{12}$/.test(sanitizedAadhaarInput);
  
      this.techInputFieldErrors = isValidAadhaar
        ? { message: '', type: '' }
        : { message: 'Invalid Aadhaar format.', type: 'techInputValue' };
    }
    
    // Step 4: Clear the error if the input doesn't match the allowed format
    else {
      this.techInputFieldErrors = { message: '', type: '' };
    }
  }
  
 
  handleBillingInputChange(event: any): void {
    this.billingInputFieldErrors = { message: '', type: '' };
    let inputValue1=event.trim();
    if(!inputValue1){
      this.billingInputFieldErrors ={message:'', type:''}
      return;
    }
    let inputValue = event;
  
    // Step 2: Handle PAN validation
    if (this.billingSelectedDocType === 'PAN') {
      let sanitizedInput = inputValue.replace(/[^A-Z0-9]/g, ''); // Remove special characters
      this.billingInputValue = sanitizedInput;
  
      // Validate PAN format: 5 letters + 4 digits + 1 letter
      const isValidPAN = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(sanitizedInput);
  
      this.billingInputFieldErrors = isValidPAN
        ? { message: '', type: '' }
        : { message: 'Invalid PAN format.', type: 'billingInputValue' };
        localStorage.setItem('billFormatError', JSON.stringify(this.billingInputFieldErrors));
    }
      
    
  
    // Step 3: Handle Aadhaar validation and formatting with space after every 4 digits
    else if (this.billingSelectedDocType === 'Aadhaar') {
      let sanitizedAadhaarInput = inputValue.replace(/[^0-9]/g, '');
  
      // If the input value is longer than 12 digits, truncate it
      sanitizedAadhaarInput = sanitizedAadhaarInput.slice(0, 12);
  
      // Add space after every 4 digits for Aadhaar formatting
      let formattedAadhaar = sanitizedAadhaarInput.replace(/(\d{4})(?=\d)/g, '$1 ');
  
      // Update the input value with formatted Aadhaar number
      this.billingInputValue = formattedAadhaar;
  
      // Validate Aadhaar format: must be exactly 12 digits (without spaces)
      const isValidAadhaar = /^[0-9]{12}$/.test(sanitizedAadhaarInput);
  
      this.billingInputFieldErrors = isValidAadhaar
        ? { message: '', type: '' }
        : { message: 'Invalid Aadhaar format.', type: 'billingInputValue' };
    }
  
    // Step 4: Handle case for other document types (clear errors)
    else {
      this.billingInputFieldErrors = { message: '', type: '' };
      // Optionally clear localStorage if no errors
      // localStorage.removeItem('billFormatError');
    }
  }
  

  handleOrganisationFileUploadClick() {
    if (!this.organisationSelectedDocType) {
      this.organisationErrors = {
        message: 'Please select a document type.',
        type: 'docType',
      };
      return;
    }
    if (
      ['License No', 'Organisation GSTIN', 'PAN'].includes(
        this.organisationSelectedDocType
      ) &&
      !this.organisationInputValue
    ) {
      this.organisationInputFieldErrors = {
        message: 'This field is required',
        type: 'organisationInputValue',
      };
      return;
    }
    localStorage.setItem('orgdoctype',this.organisationSelectedDocType);
    localStorage.setItem('orgInputValue',this.organisationInputValue);
    this.organisationErrors = { message: '', type: '' };
    this.organisationInputFieldErrors = { message: '', type: '' };

    document.getElementById('organisationFileInput')?.click();
  }

  handleAdminFileUploadClick() {
    console.log(this.adminSelectedDocType,this.adminInputValue)
    if (!this.adminSelectedDocType) {
      this.adminErrors = {
        message: 'Please select a document type.',
        type: 'docType',
      };
      return;
    }
    if (
      ['Aadhaar', 'PAN'].includes(this.adminSelectedDocType) &&
      !this.adminInputValue
    ) {
      this.adminInputFieldErrors = {
        message: 'This field is required',
        type: 'adminInputValue',
      };
      return;
    }
    localStorage.setItem('adminErrors',JSON.stringify(this.adminErrors));
    localStorage.setItem('adminInputFieldErrors',JSON.stringify(this.adminInputFieldErrors));
    this.adminErrors = { message: '', type: '' };
    this.adminInputFieldErrors = { message: '', type: '' };
    console.log(document.getElementById('adminFileInput'))
    localStorage.setItem('Admindoctype',this.adminSelectedDocType);
    localStorage.setItem('adminInputValue',this.adminInputValue);
    document.getElementById('adminFileInput')?.click();
  }

  handleTechFileUploadClick() {
    if (!this.techSelectedDocType) {
      this.techErrors = {
        message: 'Please select a document type.',
        type: 'docType',
      };
      return;
    }
    if (
      ['Aadhaar', 'PAN'].includes(this.techSelectedDocType) &&
      !this.techInputValue
    ) {
      this.techInputFieldErrors = {
        message: 'This field is required',
        type: 'techInputValue',
      };
      return;
    }
    localStorage.setItem('techErrors',JSON.stringify(this.techErrors));
    localStorage.setItem('techInputFieldErrors',JSON.stringify(this.techInputFieldErrors));
    localStorage.setItem('techdoctype',this.techSelectedDocType);
    localStorage.setItem('techInputValue',this.techInputValue);
    this.techErrors = { message: '', type: '' };
    this.techInputFieldErrors = { message: '', type: '' };

    document.getElementById('techFileInput')?.click();
  }

  handleBillingFileUploadClick() {
    if (!this.billingSelectedDocType) {
      this.billingErrors = {
        message: 'Please select a document type.',
        type: 'docType',
      };
      return;
    }
    if (
      ['Aadhaar', 'PAN'].includes(this.billingSelectedDocType) &&
      !this.billingInputValue
    ) {
      this.billingInputFieldErrors = {
        message: 'This field is required',
        type: 'billingInputValue',
      };
      return;
    }
    localStorage.setItem('billingErrors',JSON.stringify(this.billingErrors));
    localStorage.setItem('billingInputFieldErrors',JSON.stringify(this.billingInputFieldErrors));
    localStorage.setItem('billdoctype',this.billingSelectedDocType);
    localStorage.setItem('billInputValue',this.billingInputValue);
    this.billingErrors = { message: '', type: '' };
    this.billingInputFieldErrors = { message: '', type: '' };

    document.getElementById('billingFileInput')?.click();
  }

  previewDocName:any;
  tempimageUrl:any;
  temppdfUrl:any;
  clickedDocument(docName) {
    this.tempimageUrl = '';
    this.temppdfUrl = '';
    console.log(docName);
    this.previewDocName = docName;
  
    const file = this.previewDocName.file;
  
    // Validate file name format (pan/PAN_*********)
    // const isValidFileName = this.isValidFileName(docName.fileName,docName.type);
    // if (!isValidFileName) {
    //   //this.toastrService.error('Invalid file name format. Expected format: pan/PAN_*********');
    //   return; // Stop further processing
    // }
  
    // Read the file as ArrayBuffer
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (file.type == "application/pdf") {
          console.log("entered");
          this.temppdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.target?.result as string);
          this.imageUrl.emit(null);
          this.pdfUrl.emit(this.temppdfUrl);
        } else if (file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg") {
          this.tempimageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.target?.result as string);
          this.pdfUrl.emit(null);
          this.imageUrl.emit(this.tempimageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  }
  
  clickedPreviewDoc(docName) {
    this.tempimageUrl = '';
    this.temppdfUrl = '';
    console.log(docName);
    this.previewDocName = docName;
  
    const file = this.previewDocName.file;
  
    // Validate file name format (pan/PAN_*********)
    // const isValidFileName = this.isValidFileName(docName.fileName,docName.type);
    // if (!isValidFileName) {
    // //  this..error('Invalid file name format. Expected format: pan/PAN_*********');
    //   return; // Stop further processing
    // }
  
    // Read the file as ArrayBuffer
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (file.type == "application/pdf") {
          console.log("entered");
          this.temppdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.target?.result as string);
          this.imagePreviewUrl.emit(null);
          this.pdfPreviewUrl.emit(this.temppdfUrl);
        } else if (file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg") {
          this.tempimageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.target?.result as string);
          this.pdfPreviewUrl.emit(null);
          this.imagePreviewUrl.emit(this.tempimageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  }
  
//   isValidFileName(fileName: string, docType: string): boolean {
//     // Remove the file extension (e.g., .pdf, .jpg) from the file name
//     if (docType === 'License No' || docType === 'Board Resolution' || docType==='Organisation Id') {
//       return true; // No validation needed for these types
//     }
//     const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
  
//     // Define regex for valid file name format for PAN, Aadhaar, and GSTIN
//     const panPattern = /^PAN_[A-Za-z0-9]{10}$/;
//     const aadhaarPattern = /^Aadhaar_\d{12}$/;
//     const gstinPattern = /^GSTIN_[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/;
  
//     switch (docType) {
//       case 'PAN':
//         return panPattern.test(fileNameWithoutExtension);
//       case 'Aadhaar':
//         return aadhaarPattern.test(fileNameWithoutExtension);
//       case 'Organisation GSTIN':
//         return gstinPattern.test(fileNameWithoutExtension);
//       default:
//         return false; // For any other file type, return false
//     }
  


// }
@Output() documentValidationStatus = new EventEmitter<boolean>();
@Output() ContactdocumentValidationStatus = new EventEmitter<boolean>();
// validateDocuments(): boolean {
//   const isValid = this.organisationUploadedDocs.every(doc => this.isValidFileName(doc.fileName, doc.type));
//   console.log('Document validation result:', isValid);
//   this.documentValidationStatus.emit(isValid);
//   return isValid;
// }

// validateDocuments1(): boolean {
//   // Combine all documents from admin, tech, and billing sections
//   const allDocs = [
//     ...this.adminUploadedDocs,
//     ...this.techUploadedDocs,
//     ...this.billingUploadedDocs,
//   ];

//   console.log('All docs combined:', allDocs);

//   // Validate each document and log its validation
//   const isValid = allDocs.every(doc => {
//     console.log('Validating document:', doc);
//     const result = this.isValidFileName(doc.fileName, doc.type);
//     console.log(`Document ${doc.fileName} is ${result ? 'valid' : 'invalid'}`);
//     return result;
//   });

//   console.log('Document validation result:', isValid);

//   this.ContactdocumentValidationStatus.emit(isValid);

//   return isValid;
// }





}
