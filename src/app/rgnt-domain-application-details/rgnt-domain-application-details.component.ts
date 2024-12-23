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

async confirmPayment(): Promise<void> {
  if (this.selectedFile) {
    const domainId = this.domainId.toString();
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('domainId', domainId);

    try {
      const response = await lastValueFrom(this.domainService.uploadPaymentReceipt(formData));
      console.log('Server Response:', response);
      this.domainsList.paymentStatus = 'Initiated';
      this.dialogRef.close();
    } catch (error) {
      console.error('Error uploading payment receipt:', error);
    }
  } else {
    console.error('No file selected');
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

onFileChange(event: any) {
  const file = event.target.files[0]; 

  if (file) {
    this.file = file; 
    this.fileName = file.name; 
    this.fileType = file.type;  
    console.log('File selected:', this.file);  
    this.clickedDocument(this.file)
  } else {
    console.error('No file selected.');
  }
  localStorage.setItem('uploadedFileName', this.fileName);
}

filePath: string = '';

clickedDocument(fileName){
  this.tempimageUrl=''
  this.temppdfUrl=''
  console.log(fileName);
  this.previewDocName = this.fileName;

  const file = fileName
console.log(file)
  // Read the file as ArrayBuffer
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if(file.type=="application/pdf"){
        console.log("entered")
        this.temppdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.target?.result as string);
        
      }else if(file.type=="image/png"||file.type=="image/jpeg"||file.type=="image/jpg"){
        console.log('prabhakaran');
        this.tempimageUrl=this.sanitizer.bypassSecurityTrustResourceUrl(e.target?.result as string);
        
      }
    
    };
    reader.readAsDataURL(file);
  }
  document.getElementById('hiddenUpdateModal')?.click();

  $('#exampleModel').modal('hide');
}
previewDocument(){
  $('#exampleModel').modal('hide');
  $('#viewPaymentReceipt').modal('show');
}
file: File | null = null; 
uploadFile() {
  if (!this.file) {
    this.fileError = 'Please select a file to upload.';
  } else {
   
    console.log('File uploaded:', this.file); 

    document.getElementById('closePaymentReceipt')?.click();

    $('#exampleModel').modal('show');
  }
}
popUPButtonClose(){
  $('#viewPaymentReceipt').modal('hide');
  $('#exampleModel').modal('show');
}
async uploadAndConfirmPayment(): Promise<void> {
  if (!this.selectedFile && !this.file) {
    this.fileError = 'Please select a file to upload.';
    return;
  }

  
  const fileToUpload = this.selectedFile || this.file;

  const domainId = this.domainId.toString();
  const formData = new FormData();
  formData.append('file', fileToUpload, fileToUpload.name);
  formData.append('domainId', domainId);

  try {
      const response = await lastValueFrom(this.domainService.uploadPaymentReceipt(formData));
    console.log('Server Response:', response); 

    this.domainsList.paymentStatus = 'Initiated';

    this.dialogRef.close();

  } catch (error) {
    console.error('Error uploading payment receipt:', error);
   
  }
  document.getElementById('closePaymentReceipt')?.click();

  $('#exampleModel').modal('hide');
}
temppdfUrl:any;
previewDocName:any;
  tempimageUrl:any;
 



}
