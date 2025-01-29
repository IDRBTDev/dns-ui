import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DocumentUploadService } from './service/document-upload.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';


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
  
  constructor(private documentUploadService: DocumentUploadService,private sanitizer: DomSanitizer,private fb: FormBuilder) {
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
  }
  ngOnChanges(): void {
    this.checkOrganisationValidation();
    this.checkAdminValidation();
    this.checkTechValidation();
    this.checkBillingValidation();
  }


  clearErrorsIfLicenseNo() {
    if (this.organisationSelectedDocType === 'License No') {
      this.organisationInputFieldErrors = { message: '', type: '' };
    }
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

    const validFileTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validFileTypes.includes(file.type)) {
      this.organisationErrors = {
        type: 'fileUpload',
        message: 'Invalid file type. Only PDF, PNG, JPG, and JPEG are allowed.',
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
    this.organisationInputValue = '';
    this.organisationErrors = { message: '', type: '' };
  }

  handleAdminDocTypeChange(event: any): void {
    const target = event.target as HTMLSelectElement;
    this.adminSelectedDocType = target.value;
    this.adminInputValue = '';
    this.adminErrors = { message: '', type: '' };
  }

  handleTechDocTypeChange(event: any): void {
    const target = event.target as HTMLSelectElement;
    this.techSelectedDocType = target.value;
    this.techInputValue = '';
    this.techErrors = { message: '', type: '' };
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
    this.billingInputValue = '';
    this.billingErrors = { message: '', type: '' };
  }

  // Handle input value changes for each section
  handleOrganisationInputChange(event: any): void {
    if (/^[a-zA-Z0-9\s]*$/.test(event)) {
      this.organisationInputValue = event;
      if (this.organisationSelectedDocType === 'PAN') {
        const isValidPAN = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(event);
        this.organisationInputFieldErrors = isValidPAN
          ? { message: '', type: '' }
          : { message: 'Invalid PAN format.', type: 'organisationInputValue' };
      } else if (/^[a-zA-Z0-9\s]*$/.test(event)) {
        this.organisationInputValue = event;
        if (this.organisationSelectedDocType === 'Organisation GSTIN') {
          const isValidOrgGST = /^[0-9A-Z]{15}$/.test(event);
          this.organisationInputFieldErrors = isValidOrgGST
            ? { message: '', type: '' }
            : {
                message: 'Invalid Organization GSTIN format.',
                type: 'organisationInputValue',
              };
        }
      } else {
        this.organisationInputFieldErrors = { message: '', type: '' };
      }
    }

    //this.organisationInputFieldErrors.message = '';
  }

  handleAdminInputChange(event: any): void {
    if (/^[a-zA-Z0-9\s]*$/.test(event)) {
      // Directly update the adminInputValue from the event
      this.adminInputValue = event;
 
      // PAN validation
      if (this.adminSelectedDocType === 'PAN') {
        const isValidPAN = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(event);
        this.adminInputFieldErrors = isValidPAN
          ? { message: '', type: '' }
          : { message: 'Invalid PAN format.', type: 'adminInputValue' };
      }
 
      // Aadhaar validation
       else if (this.adminSelectedDocType === 'Aadhaar') {
        let formattedAadhaar = event.replace(/\D/g, '').slice(0, 12);
        formattedAadhaar = formattedAadhaar.replace(/(\d{4})(?=\d)/g, '$1 ');
 
        this.adminInputValue = formattedAadhaar;
 
        const isValidAadhaar = /^[0-9]{12}$/.test(formattedAadhaar.replace(/\s/g, ''));
        this.adminInputFieldErrors = isValidAadhaar
          ? { message: '', type: '' }
          : { message: 'Invalid Aadhaar format.', type: 'adminInputValue' };
    }
 
      // Reset errors for other cases
      else {
        this.adminInputFieldErrors = { message: '', type: '' };
      }
 
    }
  }
 
 
  handleTechInputChange(event: any): void {
    if (/^[a-zA-Z0-9\s]*$/.test(event)) {
      this.techInputValue = event;
      if (this.techSelectedDocType === 'PAN') {
        const isValidPAN = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(event);
        this.techInputFieldErrors = isValidPAN
          ? { message: '', type: '' }
          : { message: 'Invalid PAN format.', type: 'techInputValue' };
      } else if (/^[a-zA-Z0-9\s]*$/.test(event)) {
        this.techInputValue = event;
        if (this.techSelectedDocType === 'Aadhaar') {
          //console.log(event, this.adminSelectedDocType);
       
          // Remove non-digit characters and limit to 12 digits
          let formattedAadhaar = event.replace(/\D/g, '').slice(0, 12);
       
          // Insert a space after every 4 digits
          formattedAadhaar = formattedAadhaar.replace(/(\d{4})(?=\d)/g, '$1 ');
       
          // Update the input field with the formatted Aadhaar number
          this.techInputValue = formattedAadhaar;
       
          // Validate the Aadhaar number format (12 digits, no spaces or hyphens)
          const isValidAadhaar = /^[0-9]{12}$/.test(formattedAadhaar.replace(/\s/g, ''));  // Remove spaces for validation
       
          // Set the error message if the Aadhaar number is invalid
          this.techInputFieldErrors = isValidAadhaar
            ? { message: '', type: '' }
            : { message: 'Invalid Aadhaar format.', type: 'techInputValue' };
        }
      } else {
        this.techInputFieldErrors = { message: '', type: '' };
 
        // this.techInputFieldErrors.message = '';
      }
    }
  }
 
  handleBillingInputChange(event: any): void {
    if (/^[a-zA-Z0-9\s]*$/.test(event)) {
      this.billingInputValue = event;
      if (this.billingSelectedDocType === 'PAN') {
        const isValidPAN = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(event);
        this.billingInputFieldErrors = isValidPAN
          ? { message: '', type: '' }
          : { message: 'Invalid PAN format.', type: 'billingInputValue' };
          localStorage.setItem('billFormatError',JSON.stringify(this.billingInputFieldErrors))
      } else if (/^[a-zA-Z0-9\s]*$/.test(event)) {
        this.billingInputValue = event;
        if (this.billingSelectedDocType === 'Aadhaar') {
          //console.log(event, this.adminSelectedDocType);
       
          // Remove non-digit characters and limit to 12 digits
          let formattedAadhaar = event.replace(/\D/g, '').slice(0, 12);
       
          // Insert a space after every 4 digits
          formattedAadhaar = formattedAadhaar.replace(/(\d{4})(?=\d)/g, '$1 ');
       
          // Update the input field with the formatted Aadhaar number
          this.billingInputValue = formattedAadhaar;
       
          // Validate the Aadhaar number format (12 digits, no spaces or hyphens)
          const isValidAadhaar = /^[0-9]{12}$/.test(formattedAadhaar.replace(/\s/g, ''));  // Remove spaces for validation
       
          // Set the error message if the Aadhaar number is invalid
          this.billingInputFieldErrors = isValidAadhaar
            ? { message: '', type: '' }
            : { message: 'Invalid Aadhaar format.', type: 'billingInputValue' };
        }
      } else {
        this.billingInputFieldErrors = { message: '', type: '' };
        // localStorage.setItem('billFormatError',JSON.stringify(this.billingInputFieldErrors))
      }
    }
    //this.billingInputFieldErrors.message = '';
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
