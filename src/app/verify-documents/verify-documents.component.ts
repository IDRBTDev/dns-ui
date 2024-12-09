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
    private location: Location
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
  viewCurrentData(binaryData: any, documentNumber: any ){
    //this.binaryData = null
    this.binaryData = binaryData;
    this.documentNumber = documentNumber;
    console.log(binaryData)
    console.log(this.documentNumber)

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
        if(response.status === HttpStatusCode.Ok){
          console.log(response);
          this.getContactOfficerDocuments(this.contactType, this.organisationId);
          if(approvalStatus === 'Approved'){
            this.toastr.success('Document approved.')
          }else{
            this.toastr.success('Document rejected.')
          }
        }
      }, error => {
        if(error.status === HttpStatusCode.Unauthorized){
          this.navigateToSessionTimeout();
        }
    })
  }

  storeCurrentDocumentDetails(document: any){
    this.currentDocument = document;
  }

  goBack(){
    this.location.back();
  }

}
