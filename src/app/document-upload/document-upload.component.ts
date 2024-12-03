import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DocumentUploadService } from './service/document-upload.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css'],
})
export class DocumentUploadComponent implements OnInit {
  @Input() mode: string = ''; // Default to 'organisation'
  @Input() submissionAttempted = false;
  @Output() onOrganisationValidationChange = new EventEmitter<boolean>();
  @Output() onAdminValidationChange = new EventEmitter<boolean>();

  @Output() onTechValidationChange = new EventEmitter<boolean>();
  @Output() onBillingValidationChange = new EventEmitter<boolean>();

  @Input() organisationUploadedDocs: any[] = [];
  @Input() adminUploadedDocs: any[] = [];
  @Input() billingUploadedDocs: any[] = [];
  @Input() techUploadedDocs: any[] = [];

  @Output() setOrganisationUploadedDocs = new EventEmitter<any[]>();
  @Output() setAdminUploadedDocs = new EventEmitter<any[]>();

  @Output() setTechUploadedDocs = new EventEmitter<any[]>();
  @Output() setBillingUploadedDocs = new EventEmitter<any[]>();

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

  constructor(private documentUploadService: DocumentUploadService) {}

 
  ngOnInit(): void {
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
  // Handle file uploads for each section
  handleOrganisationFileChange(event: any): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }
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
        message:
          'This file is already uploaded. Please choose a different file.',
      };
      return;
    }
    // If the file is new
    const uploadedDoc = {
      type: this.organisationSelectedDocType,
      fileName: file.name,
      fileSize: file.size, // Optional for extra checks
      value: this.organisationInputValue || null,
      file:event.target.files[0]
    };
    
    this.organisationUploadedDocs.push(uploadedDoc);

    this.organisationErrors = { message: '', type: '' };
    this.organisationInputFieldErrors = { message: '', type: '' };
    //this.clearErrors();
    input.value = ''; // Reset file input

    //this.handleFileUpload(event, this.organisationDocs, this.organisationErrors, 'Organisation');
  }

  handleAdminFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }
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
    const fileExists = this.adminUploadedDocs.some(
      (doc) => doc.fileName === file.name && doc.fileSize === file.size
    );
    if (fileExists) {
      this.adminErrors = {
        type: 'fileUpload',
        message:
          'This file is already uploaded. Please choose a different file.',
      };
      return;
    }
    // If the file is new
    const uploadedDoc = {
      type: this.adminSelectedDocType,
      fileName: file.name,
      fileSize: file.size, // Optional for extra checks
      value: this.adminInputValue || null,
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
    // If the file is new
    const uploadedDoc = {
      type: this.techSelectedDocType,
      fileName: file.name,
      fileSize: file.size, // Optional for extra checks
      value: this.techInputValue || null,
      file:file
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
    // If the file is new
    const uploadedDoc = {
      type: this.billingSelectedDocType,
      fileName: file.name,
      fileSize: file.size, // Optional for extra checks
      value: this.billingInputValue || null,
      file:file
    };

    this.billingUploadedDocs.push(uploadedDoc);

    this.billingErrors = { message: '', type: '' };
    this.billingInputFieldErrors = { message: '', type: '' };
    //this.clearErrors();
    input.value = ''; // Reset file input

    //this.handleFileUpload(event, this.billingDocs, this.billingErrors, 'Billing');
  }

  // Common method to handle file uploads

  get missingOrganisationDocs(): string[] {
    return this.organisationRequiredDocs.filter(
      (doc) => !this.isOrganisationDocUploaded(doc)
    );
  }
  get missingAdminDocs(): string[] {
    return this.adminRequiredDocs.filter(
      (doc) => !this.isAdminDocUploaded(doc)
    );
  }
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
    const isValid = this.adminUploadedDocs.length >= 4;
    console.log(isValid)
    this.onAdminValidationChange.emit(isValid);
  }
  checkTechValidation(): void {
    const isValid = this.techUploadedDocs.length >= 4;
    this.onTechValidationChange.emit(isValid);
  }
  checkBillingValidation(): void {
    const isValid = this.billingUploadedDocs.length >= 4;
    this.onBillingValidationChange.emit(isValid);
  }

  // Handle submit button
  handleDocumentSubmit(): void {
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
      .uploadDocuments(allDocs, this.applicationId, this.user, this.userMailId)
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
      this.adminInputValue = event;
      if (this.adminSelectedDocType === 'PAN') {
        const isValidPAN = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(event);
        this.adminInputFieldErrors = isValidPAN
          ? { message: '', type: '' }
          : { message: 'Invalid PAN format.', type: 'adminInputValue' };
      } else if (/^[a-zA-Z0-9\s]*$/.test(event)) {
        this.adminInputValue = event;
        if (this.adminSelectedDocType === 'Aadhaar') {
          const isValidOrgGST = /^[0-9]{12}$/.test(event);
          this.adminInputFieldErrors = isValidOrgGST
            ? { message: '', type: '' }
            : { message: 'Invalid Aadhaar format.', type: 'adminInputValue' };
        }
      } else {
        this.adminInputFieldErrors = { message: '', type: '' };
      }
    }
    //this.adminInputFieldErrors.message = '';
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
          const isValidOrgGST = /^[0-9]{12}$/.test(event);
          this.techInputFieldErrors = isValidOrgGST
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
      } else if (/^[a-zA-Z0-9\s]*$/.test(event)) {
        this.billingInputValue = event;
        if (this.billingSelectedDocType === 'Aadhaar') {
          const isValidOrgGST = /^[0-9]{12}$/.test(event);
          this.billingInputFieldErrors = isValidOrgGST
            ? { message: '', type: '' }
            : { message: 'Invalid Aadhaar format.', type: 'billingInputValue' };
        }
      } else {
        this.billingInputFieldErrors = { message: '', type: '' };
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
    this.organisationErrors = { message: '', type: '' };
    this.organisationInputFieldErrors = { message: '', type: '' };

    document.getElementById('organisationFileInput')?.click();
  }

  handleAdminFileUploadClick() {
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
    this.adminErrors = { message: '', type: '' };
    this.adminInputFieldErrors = { message: '', type: '' };

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
    this.billingErrors = { message: '', type: '' };
    this.billingInputFieldErrors = { message: '', type: '' };

    document.getElementById('billingFileInput')?.click();
  }
}


