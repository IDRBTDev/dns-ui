import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomainService } from '../rgnt-domain/service/domain.service';
import { DomainApplicationDetailsService } from '../domain-application-details/service/domain-application-details.service';
import { ToastrService } from 'ngx-toastr';
import { Domain } from '../model/domain.model';
import { HttpStatusCode } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-rgnt-domain-application-details',
  templateUrl: './rgnt-domain-application-details.component.html',
  styleUrls: ['./rgnt-domain-application-details.component.css']
})
export class RgntDomainApplicationDetailsComponent implements OnInit {

  @ViewChild('paymentDialog') paymentDialog!: TemplateRef<any>;
  selectedFile: File | null = null;
  dialogRef!: MatDialogRef<any>;
  selectedFileName: string = 'No File Selected';

  role: string = localStorage.getItem('userRole');

  constructor(private route: ActivatedRoute,
    private domainService: DomainService,
     private oreganizationService:DomainApplicationDetailsService,
     private toastrService: ToastrService,
    private router: Router,private sanitizer: DomSanitizer,
  private dialog: MatDialog) {
    const savedFileName = localStorage.getItem('uploadedFileName');
    if (savedFileName) {
      this.fileName = savedFileName;
    }
  }
  domainId: number; 
  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(param => {
      var domainId = param['domainId'];
      this.domainId = param['domainId'];
    })
    console.log(this.domainId)
    await this.getDomainApplicationDetails(this.domainId);
    console.log('executed')
    console.log('executed2')
    this.setNsStatusOptions();
    this.route.queryParams.subscribe(params => {
      this.fileName = params['fileName'];
      this.fileType = params['fileType'];
    });
  }
  domainsList: Domain;
  async getDomainApplicationDetails(domainId:number) {
   
    console.log("Datal",domainId)
    this.domainService.getDomainByDomainId(domainId).subscribe({
      next: (res) => {
        if (res.status === HttpStatusCode.Ok) {
          this.domainsList = res.body;
          this.fileName=this.domainsList.paymentReceiptName;
         console.log("domain data received:",res);
        this.getOrganizationDetails(this.domainsList.organisationId);
        } else {
          console.log("Unexpected status code:", res.status);
         
        }
      },
      error: (error) => {
        console.error("Error fetching domain data:", error);
      }
    });
  }

  organizationsList:any;
  async getOrganizationDetails(organisationId:number) {
   
    console.log("Datal",organisationId)
    this.oreganizationService.getOrganizationByDomainId(organisationId).subscribe({
      next: (res) => {
        if (res.status === HttpStatusCode.Ok) {
          this.organizationsList = res.body;
         console.log("organization data received:",res);
        } else {
          console.log("Unexpected status code:", res.status);
        }
      },
      error: (error) => {
        console.error("Error fetching organization data:", error);
      }
    });
  }

  domain : Domain = new Domain()

  updateDomain() {
    console.log('Starting domain update process...');
    console.log(this.domain)
    this.oreganizationService.updateDomain(this.domainId, this.domainsList).subscribe({
        next: (response) => {
            console.log('Response received:', response);

            if (response.status === HttpStatusCode.Ok) {
                console.log('Domain update successful.');

                  //this.domain = response.body;
                

                this.toastrService.success("Domain data updated successfully.");
            } else if (response.status === HttpStatusCode.NotFound) {
                console.log('Domain not found.');
                this.toastrService.error("Domain not found.");
            } else {
                console.log('Unexpected response status:', response.status);
                this.toastrService.error("Unexpected error during update.");
            }
        },
        error: (error) => {
            console.error('Error occurred during domain update:', error);

            if (error.status === HttpStatusCode.InternalServerError) {
                console.log('Internal server error.');
                this.toastrService.error("Internal server error. Domain data not updated.");
            } else {
                console.log('Other error status:', error.status);
                this.toastrService.error("An error occurred while updating the domain.");
            }

            console.error('Full error:', error);
        }
    });
}

onPaymentStatusChange() {

  this.setNsStatusOptions();
}
 

nsStatusOptions: string[] = [];
status:string[]=[];

isNsStatusDisabled: boolean = true;  

setNsStatusOptions() {

  if (this.domainsList.paymentStatus) {
    this.isNsStatusDisabled = false; 
  } else {
    this.isNsStatusDisabled = true;   
  }
}

cancelDomain(){
this.router.navigateByUrl('applications');
}

openPaymentDialog(): void {
  this.dialogRef = this.dialog.open(this.paymentDialog, {
    width: '500px',
  });
}

onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
    this.selectedFileName = input.files[0].name;
    console.log(`File selected: ${this.selectedFile.name}`);
    this.fileType = this.selectedFile.type;
    this.fileName = this.selectedFileName;
  }
}



onDialogClose(): void {
  this.dialogRef.close();
}

fileName: string = '';
fileType: string = ''; 
fileError: string | null = null; 



cancelButton(){
  window.location.reload();
}
closedButton(){
  $('#exampleModel').modal('hide');
}
updatecancelButton(){
  $('#updateModal').modal('hide');
}
 onFileChange1(event: any) {
  const file = event.target.files[0];  // Get the selected file

  if (file) {
    this.fileError = '';
    this.file = file;
    this.fileName = file.name;
    this.selectedFile = file;
    this.fileType = file.type;
    
    console.log('File selected:', this.file);
  
    // Define the maximum allowed file size (in MB)
    const maxFileSize = this.maxFileSizeInMB * 1024 * 1024; // Convert MB to bytes
    
    // Check if the file type is valid
    if (
      this.fileType === 'application/pdf' ||
      this.fileType === 'image/png' ||
      this.fileType === 'image/jpeg' ||
      this.fileType === 'image/jpg'
    ) {
      // Check if the file size is valid
      if (this.file.size > maxFileSize) {
        this.toastrService.error(`Please select a file less than ${this.maxFileSizeInMB}MB.`);
        this.file = null;  // Reset the file input field
        this.fileName = ''; // Clear the file name display
        return;  // Stop further execution if the file is too large
      }
      localStorage.setItem('uploadedFileName', this.fileName);
      
      // You can add other logic here to handle the file (e.g., file upload, preview)
    } else {
      // If the file type is invalid, show an error message
      this.toastrService.error('Invalid file type. Only PDF, PNG, JPG, and JPEG are allowed.');
      this.file = null;  // Reset the file input field
      this.fileName = ''; // Clear the file name display
    }
  } else {
    // If no file is selected, log the message or handle it as needed
    console.error('No file selected.');
  }
}


onFileChange(event: any, type: string) {
  const file = event.target.files[0];
 
  if (file) {
    
    this.fileError = '';
    const fileType = file.type;
    const fileSize = file.size; // File size in bytes

    const MAX_FILE_SIZE = this.maxFileSizeInMB * 1024 * 1024; // 2MB limit

    // Validate file type and size
    if (
      fileType === 'application/pdf' ||
      fileType === 'image/png' ||
      fileType === 'image/jpeg' ||
      fileType === 'image/jpg'
    ) {
      if (fileSize <= MAX_FILE_SIZE) {
        this.file = file;
        this.fileName = file.name;
        this.fileType = fileType;
      
        this.fileError = ''; // Clear any previous error
      //  this.clickedDocument(file);
      } else {
        this.fileError = 'File size exceeds the 2MB limit. Please upload a smaller file.';
        this.file = null;
        this.fileName = '';
      }
    } else {
      this.fileError = 'Invalid file type. Only PDF, DOC, JPEG, and PNG are allowed.';
      this.file = null;
      this.fileName = '';
    }
  }
}
closeModal() {
  this.fileName = '';
  this.fileError = '';
  this.file = null;
  // Add logic to hide the modal here, e.g., using Bootstrap modal methods
}

filePath: string = '';


// clickedDocument(file: File) {
//   this.tempimageUrl = '';  // Reset image preview
//   this.temppdfUrl = '';  // Reset PDF preview

//   const fileType = file.type;

//   // Set file name for preview
//   this.previewDocName = file.name;

//   const reader = new FileReader();
//   reader.onload = (e) => {
//     if (fileType === 'application/pdf') {
//       // Handle PDF
//       this.temppdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.target?.result as string);
//       console.log('PDF URL:', this.temppdfUrl); 
//     } else if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/jpg') {
//       // Handle image
//       this.tempimageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.target?.result as string);
//     };

//     reader.readAsDataURL(file);
//   }
  
// }
// previewDocument(){
//   $('#updateModal').modal('hide');
//   $('#viewPaymentReceipt').modal('show');
  
// }
previewDocument() {
  console.log("Previewing Document: ", this.file);
  $('#updateModal').modal('hide');
  $('#viewPaymentReceipt').modal('show');
  this.tempimageUrl = ''; 
  this.temppdfUrl = ''; 

  const file = this.selectedFile; // Get the file that was selected previously
  
  const fileType = file.type;
  console.log('File Type:', fileType);

  const reader = new FileReader();
  
  reader.onload = (e) => {
    if (fileType === 'application/pdf') {
      this.temppdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.target?.result as string);
      console.log('PDF URL:', this.temppdfUrl);
    } else if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/jpg') {
      this.tempimageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.target?.result as string);
      console.log('Image URL:', this.tempimageUrl);
    }
  };

  reader.readAsDataURL(file);  // Read file as Data URL
}

file: File | null = null; 
maxFileSizeInMB: number = environment.maxFileSizeMB;




popUPButtonClose(){
  $('#viewPaymentReceipt').modal('hide');
  $('#updateModal').modal('show');
}


temppdfUrl:any;
previewDocName:any;
  tempimageUrl:any;
 

  uploadPaymentReceipt() {
    if (!this.file) {
      this.fileError = 'Please select a file to upload';
      return;
    }
    
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('domainId', this.domainId.toString());

    this.domainService.uploadPaymentReceipt(formData).subscribe(
      (response) => {
        
        document.getElementById('closePaymentReceipt')?.click();
   $('#updateModal').modal('show');
   this.toastrService.success('Payment receipt uploaded successfully!');
      },
      (error) => {
       // this.fileError = 'Error uploading file: ' + error.message;
      }
    );
  }

  updatePaymentReceipt() {
    if (!this.file) {
      this.fileError = 'Please select a file to update';
      return;
    }

    this.domainService.updatePaymentReceipt(this.domainId, this.file).subscribe(
      (response) => {
        console.log('Response:', response);  // Log the response to see the exact structure
        if (response && response.message) {
        this.toastrService.success(' payment receipt updated successfully');
          $('#updateModal').modal('hide');
        } else {
          alert('Unexpected response format');
        }
      },
      (error) => {
        console.error('Error response:', error);  // Log the error for debugging
        this.fileError = error.error?.message || 'Error updating file';  // Show the error message
      }
    );
}



}
