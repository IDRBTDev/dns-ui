import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ContactDocumentUploadService } from '../contact-document-upload/service/contact-document-upload.service';
import { lastValueFrom } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { param } from 'jquery';

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

  displayedColumns: string[] = [
    // 'checkbox',
    'id',
    'document',
    'documentType',
    'approveOrReject',
    'comment',
  ];

  contactType: string = '';
  organisationId: number = 0;
  constructor(private contactDocumentsService: ContactDocumentUploadService,
    private router: Router, private activatedRouter: ActivatedRoute
  ){
    this.documentsListDataSource = new MatTableDataSource<any>();
    this.activatedRouter.queryParams.subscribe(param => {
      this.contactType = param['contactUserType'];
      this.organisationId = param['organisationId'];
    })
  }

  async ngOnInit(): Promise<void> {
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
  }

  changeDocumentStatus(documentStatus: string,document: any){

  }

  binaryData: string = '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';

  documentNumber: any = '';
  viewCurrentData(binaryData: any, documentNumber: any ){
    //this.binaryData = null
    //this.binaryData = binaryData;
    this.documentNumber = documentNumber;
    console.log(binaryData)

  }

}
