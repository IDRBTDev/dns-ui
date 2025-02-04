import { Component, OnInit } from '@angular/core';
import { DomainService } from '../rgnt-domain/service/domain.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpStatusCode } from '@angular/common/http';
import { DomainApplicationDetailsService } from './service/domain-application-details.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, lastValueFrom } from 'rxjs';
import { Domain } from '../model/domain.model';
import { error } from 'jquery';
import { DocumentUploadService } from '../document-upload/service/document-upload.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ContactDetailsFormService } from '../contact-details-form/service/contact-details-form.service';
import { ContactDocumentUploadService } from '../contact-document-upload/service/contact-document-upload.service';
// import { ContactDetailsFormComponent } from '../contact-details-form/contact-details-form.component';


@Component({
  selector: 'app-domain-application-details',
  templateUrl: './domain-application-details.component.html',
  styleUrls: ['./domain-application-details.component.css']
})
export class DomainApplicationDetailsComponent implements OnInit{

  role: string = localStorage.getItem('userRole');

  constructor(private route: ActivatedRoute,
    private domainService: DomainService,
     private oreganizationService:DomainApplicationDetailsService,
     private toastrService: ToastrService,
     private documentService:DocumentUploadService,
     private sanitizer:DomSanitizer,
    private router: Router,
        private contactDetailsService: ContactDetailsFormService,private contactDocumentsService:ContactDocumentUploadService) {
    
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
    this.getOrganizationDetails(this.domain.organisationId);
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
        console.log(res)
        if (res.status === HttpStatusCode.Ok) {
          console.log(res.body)
          this.organizationsList = res.body;
          console.log(this.organizationsList,organisationId)
          this.getOrgDocuments(organisationId);

         
         console.log("organization data received:", this.organizationsList);
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

approvePaymentStatus(){
  this.domainsList.paymentStatus="Paid"
  this.oreganizationService.updateDomain(this.domainId, this.domainsList).subscribe({
    next: (response) => {
        console.log('Response received:', response);

        if (response.status === HttpStatusCode.Ok) {
          this.toastrService.success("Payment Status updated to paid");
        } else if (response.status === HttpStatusCode.NotFound) {
          console.log('Domain not found.');
          this.toastrService.error("Domain not found.");
      } else {
          console.log('Unexpected response status:', response.status);
          this.toastrService.error("Unexpected error during update.");
      }
      },error:(error)=>{

      }
    })

}
rejectPaymentStatus(){
  console.log(this.domainsList.paymentStatus)
if(this.domainsList.paymentStatus=="Paid") {
  this.toastrService.warning("Already Paid");
}else{
  if(this.domainsList.paymentStatus="Initiated"){
    this.domainsList.paymentStatus="Unpaid";
    this.oreganizationService.updateDomain(this.domainId, this.domainsList).subscribe({
      next: (response) => {
          console.log('Response received:', response);
  
          if (response.status === HttpStatusCode.Ok) {
            this.toastrService.success("Application Rejected");
          } else if (response.status === HttpStatusCode.NotFound) {
            console.log('Domain not found.');
            this.toastrService.error("Domain not found.");
        } else {
            console.log('Unexpected response status:', response.status);
            this.toastrService.error("Unexpected error during update.");
        }
        },error:(error)=>{
  
        }
      })
   

  }
}

}
gstDoc:any
panDoc:any
licenseDoc:any
boardResolutionDoc:any;
entireOrgDocsObj:any;
panDocPdf:any
gstDocPdf:any
licenceDocPdf:any
boardResolutionDocPdf:any
orgGstStatus;
orgPanStatus;
orgLicenceStatus;
orgBoardStatus;
 async getOrgDocuments(orgId){
  this.documentService.getOrgDoucumentsById(orgId).subscribe({
    next: (response) => {
      console.log("hello")
      this.entireOrgDocsObj=response.body;
     
      this.entireOrgDocsObj.forEach(doc => {
        if (doc.organisationGstinNumber && doc.organisationGstinNumber.trim() !== '') { 
          this.orgGstStatus = doc.documentStatus; 
        }
        if (doc.panNumber && doc.panNumber.trim() !== '') { 
          this.orgPanStatus = doc.documentStatus; 
        }
        if (doc.licenseNumber && doc.licenseNumber.trim() !== '') { 
          this.orgLicenceStatus = doc.documentStatus; 
        }
        if(doc.boardResolutionDocument){
          this.orgBoardStatus=doc.documentStatus
        }
        // ... similar checks for other document types
      });
      this.getContactOfficerDocuments(orgId);
    
    },error:(error)=>{
  
    }
})
}
BoardDocImage:boolean;
OrgGstDocImage:boolean;
OrgLicenceImage:boolean;
OrgPanImage:boolean;
viewDocuments(docType){
  if(docType=='GSTIN'){
    this.gstDoc = this.extractDocument(this.entireOrgDocsObj, 'organisationGstinDocument');
    if (this.gstDoc?.size > 0 && this.gstDoc.get('fileName').endsWith('.pdf')) {
      this.displayPdf(this.gstDoc.get('document'), "organisationGstinDocument"); 
      this.OrgGstDocImage=false
      document.getElementById("gstModal")?.click();
    } else if (this.gstDoc.size > 0) { 
      this.OrgGstDocImage=false
      this.gstDoc = this.extractDocumentImage(this.entireOrgDocsObj, 'organisationGstinDocument'); 
      document.getElementById("gstModal")?.click();
    }
   
  }else if(docType=='PAN'){
    this.panDoc = this.extractDocument(this.entireOrgDocsObj, 'panDocument');
     
    if (this.panDoc?.size > 0 && this.panDoc?.get('fileName').endsWith('.pdf')) {
      this.displayPdf(this.panDoc.get('document'), "panDocument"); // Corrected documentField
      this.OrgPanImage=false;
      document.getElementById("panModal")?.click();
    } else if (this.panDoc.size > 0) { 
      this.panDoc = this.extractDocumentImage(this.entireOrgDocsObj, 'panDocument');
      this.OrgPanImage=true;
      document.getElementById("panModal")?.click(); 
    }
  }else if(docType=='LICENCE'){
    this.licenseDoc = this.extractDocument(this.entireOrgDocsObj, 'licenseDocument');
    if (this.licenseDoc?.size > 0 && this.licenseDoc.get('fileName').endsWith('.pdf')) {
      this.displayPdf(this.licenseDoc.get("document"), "licenseDocument"); // Corrected documentField
      this.OrgLicenceImage=false;
      document.getElementById("licenceModal")?.click(); 
    } else if (this.licenseDoc.size > 0) { 
      this.licenseDoc = this.extractDocumentImage(this.entireOrgDocsObj, 'licenseDocument'); 
      this.OrgLicenceImage=true;
      document.getElementById("licenceModal")?.click(); 
    }
  }else{
    this.boardResolutionDoc = this.extractDocument(this.entireOrgDocsObj, 'boardResolutionDocument');
    if (this.boardResolutionDoc?.size > 0 && this.boardResolutionDoc.get('fileName').endsWith('.pdf')) {
      this.displayPdf(this.boardResolutionDoc.get("document"), "boardResolutionDocument"); // Corrected documentField
      this.BoardDocImage=false;
      document.getElementById("boardModal")?.click(); 
    } else if (this.boardResolutionDoc.size > 0) { 
      console.log("entered the else")
      this.BoardDocImage=true;
      this.boardResolutionDoc = this.extractDocumentImage(this.entireOrgDocsObj, 'boardResolutionDocument'); 
      document.getElementById("boardModal")?.click(); 
    }
  }
}
private extractDocument(orgDocs: any, documentField: string): Map<string, any> {
  console.log(documentField)
  const foundDoc = orgDocs.find(doc => !!doc[documentField]);

  if (foundDoc) {
    return new Map([
      ['fileName', foundDoc.fileName], 
      ['document', foundDoc[documentField]]
    ]);
  } else {
    return new Map(); 
  }
}
private extractDocumentImage(orgDocs: any, documentField: string): any {
  const foundDoc = orgDocs.find(doc => !!doc[documentField]);

  if (foundDoc) {
    return foundDoc[documentField]; 
  } else {
    return null; 
  }
}
displayPdf(binaryData,docName) {
  if (typeof binaryData === 'string') { 
    // If data is a Base64 string
    const binaryString = atob(binaryData); 
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'application/pdf' });
    
    // const arrayBuffer = new Uint8Array(binaryData);
  
    if(docName=="organisationGstinDocument"){
     // const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
     const pdfUrl = URL.createObjectURL(blob);
      this.gstDocPdf = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl); 
    }
    if(docName=="panDocument"){
      const pdfUrl = URL.createObjectURL(blob);
      this.panDocPdf = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl); 
    }
    if(docName=="licenseDocument"){
      const pdfUrl = URL.createObjectURL(blob);
      this.licenceDocPdf = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl); 
    }
    if(docName=="boardResolutionDocument"){
      const pdfUrl = URL.createObjectURL(blob);
      this.boardResolutionDocPdf = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl); 
    }
} 
}
approveOrgDocs(OrgDoc){
  console.log(OrgDoc)
  if(OrgDoc=='PAN'){
    this.orgPanStatus="Approved"
    this.changeDocStatus(OrgDoc,this.orgPanStatus,this.domainsList.organisationId);
  }else if(OrgDoc=='LICENCE'){
this.orgLicenceStatus="Approved"
this.changeDocStatus(OrgDoc,this.orgLicenceStatus,this.domainsList.organisationId);
  }else if(OrgDoc=='BOARD'){
this.orgBoardStatus="Approved"
this.changeDocStatus(OrgDoc,this.orgBoardStatus,this.domainsList.organisationId);
  }else if(OrgDoc=="GST"){
this.orgGstStatus="Approved"
this.changeDocStatus(OrgDoc,this.orgGstStatus,this.domainsList.organisationId);
  }
}
rejectOrgDocs(OrgDoc){

  if(OrgDoc=='PAN'){
    this.orgPanStatus="Rejected"
    this.changeDocStatus(OrgDoc,this.orgPanStatus,this.domainsList.organisationId);
  }else if(OrgDoc=='LICENCE'){
this.orgLicenceStatus="Rejected"
this.changeDocStatus(OrgDoc,this.orgLicenceStatus,this.domainsList.organisationId);
  }else if(OrgDoc=='BOARD'){
this.orgBoardStatus="Rejected"
this.changeDocStatus(OrgDoc,this.orgBoardStatus,this.domainsList.organisationId);
  }else if(OrgDoc=='GST'){
this.orgGstStatus="Rejected"
this.changeDocStatus(OrgDoc,this.orgGstStatus,this.domainsList.organisationId);
  }
}

changeDocStatus(DocType,Status,OrgId){
  this.documentService.approveOrRejectOrgDocs(DocType,Status,OrgId).subscribe({
    next:(response)=>{
      this.toastrService.success("Document "+Status)
    },error:(eror)=>{

    }
  }
  )
}
navigateToRegistrantOfficersApprove(){
  console.log(this.domainsList.bankName)
  this.router.navigate(['/rgtr-rgnt-ofd'], { queryParams: { data: this.domainsList.organisationId } });
  // this.router.navigateByUrl('rgtr-rgnt-ofd', { state: { data: this.domainsList.bankName } });
}

adminStatus:string;
technicalOfficerStatus:string;
billingOfficerStatus:string;
contactOfficerDetails:any


  getContactOfficerDocuments(organisationId: number): void {
  this.contactDocumentsService.getDocStatusOfOfficers(organisationId)
    .subscribe({
      next: (response) => {
        if (response.status === HttpStatusCode.Ok) {
        const allStatus= response.body[0].split(",")
         this.adminStatus=allStatus[0];
         this.technicalOfficerStatus=allStatus[1];
         this.billingOfficerStatus=allStatus[2];
         this.changeStatusOfpayment();
        }
      },
      error: (error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          // Your logic for Unauthorized error here
        }
      }
    });
}
changeStatusOfpayment(){
  console.log(this.domainsList.paymentStatus)
  if(this.domainsList.paymentStatus=="Unpaid"){
    console.log(this.billingOfficerStatus=="Approved",this.adminStatus=="Approved",this.technicalOfficerStatus=="Approved",
      this.orgBoardStatus=="Approved",this.orgGstStatus=="Approved",this.orgLicenceStatus=="Approved",this.orgPanStatus=="Approved")
    if(this.billingOfficerStatus=="Approved"&&this.adminStatus=="Approved"&&this.technicalOfficerStatus=="Approved"&&
      this.orgBoardStatus=="Approved"&&this.orgGstStatus=="Approved"&&this.orgLicenceStatus=="Approved"&&this.orgPanStatus=="Approved"){
        this.domainsList.paymentStatus="Ready for payment"
      }
  }
  
  
}

}

