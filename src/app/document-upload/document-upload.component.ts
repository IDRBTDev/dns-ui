import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DocumentUploadService } from './service/document-upload.service';

@Component({
    selector: 'app-document-upload',
    templateUrl: './document-upload.component.html',
    styleUrls: ['./document-upload.component.css']
})
export class DocumentUploadComponent implements OnInit {
    @Input() uploadedDocs: any[] = [];
    @Input() submissionAttempted = false;
    @Output() onValidationChange = new EventEmitter<boolean>();
    @Output() setUploadedDocs = new EventEmitter<any[]>();

    selectedDocType = '';
    inputValue = '';
    errors = { message: '', type: '' };
    requiredDocs = ['License No', 'Organisation GSTIN', 'PAN', 'Board Resolution'];
    docTypes = [...this.requiredDocs, 'Others'];

    applicationId = ''; // Replace with appropriate value
    user = ''; // Replace with appropriate value
    userMailId = localStorage.getItem('email');

    constructor(private documentUploadService: DocumentUploadService) { }

    ngOnInit(): void {
        //console.log("checking validaiton");
        //this.submissionAttempted=false;
        this.checkValidation();
    }

    handleDocTypeChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.selectedDocType = target.value;
        this.inputValue = '';
        this.errors = { message: '', type: '' };
    }

    handleInputChange(value: string): void {
        if (/^[a-zA-Z0-9\s]*$/.test(value)) {
            this.inputValue = value;
            if (this.selectedDocType === 'PAN') {
                const isValidPAN = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
                this.errors = isValidPAN
                    ? { message: '', type: '' }
                    : { message: 'Invalid PAN format.', type: 'inputValue' };
            } else {
                this.errors = { message: '', type: '' };
            }
        }
    }

    handleFileUploadClick(): void {
        if (!this.selectedDocType) {
            this.errors = { message: 'Please select a document type.', type: 'docType' };
            return;
        }
        if (['License No', 'Organisation GSTIN', 'PAN'].includes(this.selectedDocType) && !this.inputValue) {
            this.errors = { message: 'This field is required', type: 'inputValue' };
            return;
        }
        this.errors = { message: '', type: '' };
        document.getElementById('fileInput')?.click();
    }

    handleFileChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        const files = Array.from(target.files || []);
        const newUploadedDocs = files.map((file: File) => ({
            type: this.selectedDocType,
            value: this.inputValue,
            fileName: file.name,
            file,
        }));

        this.uploadedDocs = [...this.uploadedDocs, ...newUploadedDocs];
        this.setUploadedDocs.emit(this.uploadedDocs);

        this.selectedDocType = '';
        this.inputValue = '';
        this.errors = { message: '', type: '' };
    }

    handleRemoveDoc(index: number): void {
        this.submissionAttempted=false;
        this.uploadedDocs.splice(index, 1);
        this.setUploadedDocs.emit(this.uploadedDocs);
    }

    isDocUploaded(docType: string): boolean {
        return this.uploadedDocs.some(doc => doc.type === docType);
    }

    checkValidation(): void {
        const isValid = this.uploadedDocs.length >= 4;
        this.onValidationChange.emit(isValid);
    }

    get missingDocs(): string[] {
        return this.requiredDocs.filter(doc => !this.isDocUploaded(doc));
    }

    handleDocumentSubmit(): void {
        this.submissionAttempted=true;
        if (this.uploadedDocs.length === 0) {
            this.errors = { message: 'No documents uploaded!', type: '' };
            //console.log(this.errors);
            return;
        }

        this.documentUploadService
            .uploadDocuments(this.uploadedDocs, this.applicationId, this.user, this.userMailId)
            .subscribe({
                next: (res) => console.log('Upload successful:', res),
                error: (err) => console.error('Error uploading documents:', err),
            });
    }
}
