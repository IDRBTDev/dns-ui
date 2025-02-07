import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ContactDocumentUploadService } from '../contact-document-upload/service/contact-document-upload.service';
import { lastValueFrom } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { param } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-verify-documents',
  templateUrl: './verify-documents.component.html',
  styleUrls: ['./verify-documents.component.css']
})
export class VerifyDocumentsComponent implements OnInit {

  documentsList: any[];
  documentsListDataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  role: string = localStorage.getItem('userRole');
  userEmailId = localStorage.getItem('email');
  searchText:String='';

  displayedColumns: string[] = [];

  contactType: string = '';
  organisationId: number = 0;
  constructor(private contactDocumentsService: ContactDocumentUploadService,
    private router: Router, private activatedRouter: ActivatedRoute,
    private toastr: ToastrService,
    private location: Location,
    private sanitizer:DomSanitizer
  ){
    this.documentsListDataSource = new MatTableDataSource<any>();
    this.activatedRouter.queryParams.subscribe(param => {
      this.contactType = param['contactUserType'];
      this.organisationId = param['organisationId'];
    })
  }

  async ngOnInit(): Promise<void> {
    if(this.role === 'IDRBTADMIN'){
      this.displayedColumns = [
        // 'checkbox',
        'id',
        'document',
        'documentType',
        'approveOrReject',
        'documentStatus',
        'comment',
      ];
    }else{
      this.displayedColumns = [
        // 'checkbox',
        'id',
        'document',
        'documentType',
       // 'approveOrReject',
        'documentStatus',
        'comment',
        'reUpload'
      ];
    }
    await this.getContactOfficerDocuments(this.contactType, this.organisationId);
  }

  navigateToSessionTimeout(){
    this.router.navigateByUrl('/session-timeout');
  }

  async getContactOfficerDocuments(contactType: string, organisationId: number){
    await lastValueFrom(this.contactDocumentsService.getContactOfficerDocuments(contactType,organisationId)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          this.documentsList = response.body;
          this.documentsListDataSource.data = this.documentsList;
          setTimeout(() => {
            this.documentsListDataSource.sort = this.sort;
            this.documentsListDataSource.paginator = this.paginator;
          },0)
          console.log(this.documentsList);
        }
      }, error => {
        if(error.status === HttpStatusCode.Unauthorized){
          this.navigateToSessionTimeout();
        }
      }
    )
    return this.documentsList;
  }

  changeDocumentStatus(documentStatus: string,document: any){

  }

  binaryData: any;
  documentNumber: any = '';
  currentDocumentId: number = 0;
  showImage:boolean;
  async viewCurrentData(binaryData: any, documentNumber: any,fileName:any ){
    //this.binaryData = null
    console.log(fileName)
    if (binaryData!=null && fileName.endsWith('.pdf')) {
           await this.displayPdf(binaryData); 
            this.showImage=false
            // console.log(document.getElementById("viewTheRgntDocs"))
            document.getElementById("viewTheRgntDocs")?.click();
          } else if (binaryData!=null) { 
            this.showImage=true;
            this.binaryData = binaryData;
            document.getElementById("viewTheRgntDocs")?.click();
          }
          
   
      this.documentNumber = documentNumber;
    // console.log(binaryData)
    // console.log(this.documentNumber)

  }
  viewTheDocsPdf:any
  async displayPdf(binaryData) {
    console.log(typeof binaryData === 'string')
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
    
      
       const pdfUrl = URL.createObjectURL(blob);
      this.viewTheDocsPdf = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl); 
    
  } 
  }

  /**
   * 
   * @param approvalStatus 
   * @param currentDocumentId 
   */
  currentDocument: any;
  documentComment: string = '';
  async approveOrRejectDocument(approvalStatus: string){
    console.log(this.currentDocument, approvalStatus)
    await lastValueFrom(this.contactDocumentsService
      .updateDocumentStatus(approvalStatus,this.currentDocument.contactDocumentId,
        this.currentDocument.organisationId,this.currentDocument.contactType, 
        this.currentDocument.documentType, this.documentComment)).then(
      response => {
        console.log(response);
        if(response.status === HttpStatusCode.Ok){
          console.log(response);
          
          if(approvalStatus === 'Approved'){
            this.toastr.success('Document approved.');
            this.clearComments();
          }else{
            this.toastr.success('Document rejected.');
            this.clearComments();
          }
        }
      }, error => {
        if(error.status === HttpStatusCode.Unauthorized){
          this.navigateToSessionTimeout();
        }
    })
    this.clearComments();
    this.getContactOfficerDocuments(this.contactType, this.organisationId);
    if(approvalStatus === 'Approved'){
      this.toastr.success('Document approved.');
      this.clearComments();
      document.getElementById("closeApproveCommentModal").click();
    }else{
      this.toastr.success('Document rejected.');
      this.clearComments();
      document.getElementById("closeRejectCommentModal").click();
    }
  }

  storeCurrentDocumentDetails(document: any){
    this.currentDocument = document;
  }

  goBack(){
    this.location.back();
  }
  clickedDocDetails:any;
  openFileReupload(documents){
    console.log(documents)
    this.clickedDocDetails=documents
    document.getElementById("reUploadDocument")?.click();
  }
  handleTheDocument(event:any){
    const file = event.target.files[0]; 
    let docType=this.clickedDocDetails['documentType']
    
    console.log(this.clickedDocDetails['contactDocumentId'])
    
    this.contactDocumentsService.updateContactDocument(this.clickedDocDetails['contactDocumentId'],file,docType).subscribe({
      next:(response)=>{
        console.log("updatedSuccessfully")
       this.getContactOfficerDocuments(this.contactType, this.organisationId);
       this.toastr.success("Document uploaded successfully")
      },error:(error)=>{
        console.log(error)
      }
    })
    
   
   
  }

  // viewDocuments(docType){
  //   if(docType=='GSTIN'){
  //     this.gstDoc = this.extractDocument(this.entireOrgDocsObj, 'organisationGstinDocument');
  //     if (this.gstDoc?.size > 0 && this.gstDoc.get('fileName').endsWith('.pdf')) {
  //       this.displayPdf(this.gstDoc.get('document'), "organisationGstinDocument"); 
  //       this.OrgGstDocImage=false
  //       document.getElementById("gstModal")?.click();
  //     } else if (this.gstDoc.size > 0) { 
  //       this.OrgGstDocImage=false
  //       this.gstDoc = this.extractDocumentImage(this.entireOrgDocsObj, 'organisationGstinDocument'); 
  //       document.getElementById("gstModal")?.click();
  //     }
     
  //   }else if(docType=='PAN'){
  //     this.panDoc = this.extractDocument(this.entireOrgDocsObj, 'panDocument');
       
  //     if (this.panDoc?.size > 0 && this.panDoc?.get('fileName').endsWith('.pdf')) {
  //       this.displayPdf(this.panDoc.get('document'), "panDocument"); // Corrected documentField
  //       this.OrgPanImage=false;
  //       document.getElementById("panModal")?.click();
  //     } else if (this.panDoc.size > 0) { 
  //       this.panDoc = this.extractDocumentImage(this.entireOrgDocsObj, 'panDocument');
  //       this.OrgPanImage=true;
  //       document.getElementById("panModal")?.click(); 
  //     }
  //   }else if(docType=='LICENCE'){
  //     this.licenseDoc = this.extractDocument(this.entireOrgDocsObj, 'licenseDocument');
  //     if (this.licenseDoc?.size > 0 && this.licenseDoc.get('fileName').endsWith('.pdf')) {
  //       this.displayPdf(this.licenseDoc.get("document"), "licenseDocument"); // Corrected documentField
  //       this.OrgLicenceImage=false;
  //       document.getElementById("licenceModal")?.click(); 
  //     } else if (this.licenseDoc.size > 0) { 
  //       this.licenseDoc = this.extractDocumentImage(this.entireOrgDocsObj, 'licenseDocument'); 
  //       this.OrgLicenceImage=true;
  //       document.getElementById("licenceModal")?.click(); 
  //     }
  //   }else{
  //     this.boardResolutionDoc = this.extractDocument(this.entireOrgDocsObj, 'boardResolutionDocument');
  //     if (this.boardResolutionDoc?.size > 0 && this.boardResolutionDoc.get('fileName').endsWith('.pdf')) {
  //       this.displayPdf(this.boardResolutionDoc.get("document"), "boardResolutionDocument"); // Corrected documentField
  //       this.BoardDocImage=false;
  //       document.getElementById("boardModal")?.click(); 
  //     } else if (this.boardResolutionDoc.size > 0) { 
  //       console.log("entered the else")
  //       this.BoardDocImage=true;
  //       this.boardResolutionDoc = this.extractDocumentImage(this.entireOrgDocsObj, 'boardResolutionDocument'); 
  //       document.getElementById("boardModal")?.click(); 
  //     }
  //   }
  // }

  clearComments(){
    this.documentComment='';
  }

}
