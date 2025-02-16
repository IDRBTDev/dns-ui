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
import { ContactDetailsFormService } from '../contact-details-form/service/contact-details-form.service';
import { Roles } from '../model/roles.model';
import { RolesService } from '../roles/services/roles.service';
import { UserService } from '../user/service/user.service';

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
  verifyEmailId:string
  

  displayedColumns: string[] = [];

  contactType: string = '';
  organisationId: number = 0;
  constructor(private contactDocumentsService: ContactDocumentUploadService,
    private router: Router, private activatedRouter: ActivatedRoute,
    private toastr: ToastrService,
    private location: Location,
    private sanitizer:DomSanitizer,
    private contactDetailsService:ContactDetailsFormService,
    private roleService:RolesService,private userService:UserService
  ){
    this.documentsListDataSource = new MatTableDataSource<any>();
    this.activatedRouter.queryParams.subscribe(param => {
      this.contactType = param['contactUserType'];
      this.organisationId = param['organisationId'];
      this.verifyEmailId = param['email'];
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
    this.getAllRoles();
    await this.getContactOfficerDocuments(this.contactType, this.organisationId);
    await this.getContactOfficersDetails(this.organisationId)
    // await this.get
    // await this.get
  }
  user = {
    id: 0,
    userName: '',
    userId: '',
    userRoles:[],
    active: false,
    encryptedPassword: '',
    mobileNumber: '',
    confirmPassword: '',
    createdByEmailId:'',
    organisationId:0,
    organisationDetails: {},
    isOnboardingCompleted: false
  }

  navigateToSessionTimeout(){
    this.router.navigateByUrl('/session-timeout');
  }

  AllRoles:Roles[]
  getAllRoles(){
    this.roleService.getAllRoles().subscribe({
      next:(response)=>{
      this.AllRoles=response.body;
      },error:(error)=>{
        console.log(error)
      }
    })
  }
  contactDetailsList: any[] = [];
    async getContactOfficersDetails(selectedOrganisationId: number){
      await lastValueFrom(this.contactDetailsService.getContactOfficersDetails(selectedOrganisationId)).then(
        response => {
          if(response.status === HttpStatusCode.Ok){
            console.log(response.body);
            this.contactDetailsList = response.body;
          }
        },error => {
          if(error.status === HttpStatusCode.Unauthorized){
            this.navigateToSessionTimeout();
          }
        }
      )
    }
  
  contactRoleMap= new Map();
  async getContactOfficerDocuments(contactType: string, organisationId: number){
    await lastValueFrom(this.contactDocumentsService.getContactOfficerDocuments(contactType,organisationId)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          this.documentsList = response.body;
          console.log(this.documentsList)
        //   this.documentsList.forEach(document => {  // Iterate over documentsList
        //     console.log(document)
        //     this.contactRoleMap.set(document.documentType, document.documentStatus);
        // });
        console.log(this.contactRoleMap)
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

  async enableOrDisableLoginStatus(loginStatus: string, contactOfficerDetails: any){
    console.log(contactOfficerDetails.id)
    //first update the login status of contact officer and then create the user login for the contact officer
    if(contactOfficerDetails.contactRole === 'Administrative Officer'){
      await this.getAdminOfficerDetails(contactOfficerDetails.id);
      //before updating status
      // await this.getContactOfficerDocuments("Administrative",this.adminOfficerDetails.organisationId);
      let count = 0;
      console.log('exe')
      this.documentsList.forEach(doc => {
        if(doc.documentStatus === 'Approved'){
          count = count + 1;
          console.log(count)
        }else{
          count = count - 1;
          console.log(count)
        }
      });
      if(count === 3 && loginStatus === 'Approved'){
        this.adminOfficerDetails.loginStatus = 'Approved';
        this.adminOfficerDetails.isActive = true;
        await this.updateAdminOfficerLoginStatus(this.adminOfficerDetails);
      }else if(count < 3 && loginStatus === 'Approved'){
        // this.toastr.error('Document verification pending.')
        return;
      }else if(count === 3 && loginStatus === 'Rejected'){
        this.adminOfficerDetails.loginStatus = 'Rejected';
        await this.updateAdminOfficerLoginStatus(this.adminOfficerDetails);
      }else if(count < 3 && loginStatus === 'Rejected'){
        // this.toastr.error('Document verification pending');
        return;
      }
    }else if(contactOfficerDetails.contactRole === 'Technical Officer'){
      await this.getTechnicalOfficerDetails(contactOfficerDetails.id);
      console.log(this.technicalOfficerDetails.organisationId)
      await this.getContactOfficerDocuments("Technical",this.technicalOfficerDetails.organisationId);
      let count = 0;
      console.log('exe')
      this.documentsList.forEach(doc => {
        if(doc.documentStatus === 'Approved'){
          count = count + 1;
          console.log(count)
        }else{
          count = count - 1;
          console.log(count)
        }
      });
      if(count === 3){
        console.log(this.technicalOfficerDetails)
        this.technicalOfficerDetails.loginStatus = loginStatus;
        this.technicalOfficerDetails.isActive = true;
        await this.updateTechnicalOfficerLoginStatus(this.technicalOfficerDetails);
      }else{
        console.log(this.technicalOfficerDetails)
        this.technicalOfficerDetails.isActive = false;
        this.technicalOfficerDetails.loginStatus=loginStatus
        await this.updateTechnicalOfficerLoginStatus(this.technicalOfficerDetails);
        this.toastr.error('Document verification pending');
        return;
      }
    }else{
      await this.getBillingOfficerDetails(contactOfficerDetails.id);
      await this.getContactOfficerDocuments("Billing",this.billingOfficerDetails.organisationId);
      let count = 0;
      console.log('exe')
      this.documentsList.forEach(doc => {
        if(doc.documentStatus === 'Approved'){
          count = count + 1;
          console.log(count)
        }else{
          count = count - 1;
          console.log(count)
        }
      });
      if(count === 3){
        this.billingOfficerDetails.loginStatus = loginStatus;
        this.billingOfficerDetails.isActive = true;
      await this.updateBillingOfficerLoginStatus(this.billingOfficerDetails);
      }else{
        this.billingOfficerDetails.isActive = false;
        await this.updateBillingOfficerLoginStatus(this.billingOfficerDetails);
        // this.toastr.error('Document verification pending');
        return;
      }
    }
    //create the new user based on login status
    if(loginStatus === 'Approved'){
      this.user.active = true;
    }else{
      this.user.active = false;
      this.toastr.error('Login Rejected');
      return;
    }
    this.user.userName = contactOfficerDetails.personName;
    this.user.userId = contactOfficerDetails.emailId;
    if(contactOfficerDetails.contactRole=='Administrative Officer'){
      this.user.userRoles[0] = this.AllRoles.find(role => {
        return role.roleName === "Administrative Officer";
    });
    }else if(contactOfficerDetails.contactRole=='Billing Officer'){
      this.user.userRoles[0] = this.AllRoles.find(role => {
        return role.roleName === "Billing Officer";
    });
    }else if(contactOfficerDetails.contactRole=='Technical Officer'){
      this.user.userRoles[0] = this.AllRoles.find(role => {
        return role.roleName === "Technical Officer";
    });
    }
    // this.user.role = contactOfficerDetails.contactRole;
    this.user.mobileNumber = contactOfficerDetails.mobileNumber;
    this.user.createdByEmailId = localStorage.getItem('email');
    this.user.organisationId = contactOfficerDetails.organisationId;
    this.user.isOnboardingCompleted = true;
    this.user.active  = true;
    console.log(this.user);
    // return
    await lastValueFrom(this.userService.saveUser(this.user)).then(
      response => {
        console.log(response)
        if(response.status === HttpStatusCode.Created){
          console.log(response);
          this.toastr.success('Login approved');
          //if(this.role === 'IDRBTADMIN'){
             this.getContactOfficersDetails(0);
          // }else if(this.role != 'IDRBTADMIN' && parseInt(this.organisationId) > 0){
          //    this.getContactOfficersDetails(parseInt(this.organisationId));
          // }
        }
      },error => {
        if(error.status === HttpStatusCode.Unauthorized){
          this.navigateToSessionTimeout();
        }else if(error.status === HttpStatusCode.InternalServerError){
          this.toastr.error('Error while approving user... please try again !');
        }
      }
    )
  }
  async updateAdminOfficerLoginStatus(adminDetails: any){
    await lastValueFrom(this.contactDetailsService.updateAdminDetails(adminDetails)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
         // this.getContactOfficersDetails(response.body.organisationId);
         console.log(response);
        }
      }
    )
  }

  async updateTechnicalOfficerLoginStatus(techDetails: any){
    await lastValueFrom(this.contactDetailsService.updateTechDetails(techDetails)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
         // this.getContactOfficersDetails(response.body.organisationId);
         console.log(response)
        }
      }
    )
  }

  async updateBillingOfficerLoginStatus(billDetails: any){
    await lastValueFrom(this.contactDetailsService.updateBillDetails(billDetails)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
         // this.getContactOfficersDetails(response.body.organisationId);
         console.log(response)
        }
      }
    )
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
      if(this.contactType=='Administrative'){
        this.enableOrDisableLoginStatus(approvalStatus,this.contactDetailsList[0])
      }else if (this.contactType=='Billing'){
        this.enableOrDisableLoginStatus(approvalStatus,this.contactDetailsList[1])
      }else if( this.contactType=='Technical'){
        this.enableOrDisableLoginStatus(approvalStatus,this.contactDetailsList[2])
      }
      document.getElementById("closeApproveCommentModal").click();
    }else{
      this.toastr.success('Document rejected.');
      this.clearComments();
      if(this.contactType=='Administrative'){
        this.enableOrDisableLoginStatus(approvalStatus,this.contactDetailsList[0])
      }else if (this.contactType=='Billing'){
        this.enableOrDisableLoginStatus(approvalStatus,this.contactDetailsList[1])
      }else if( this.contactType=='Technical'){
        this.enableOrDisableLoginStatus(approvalStatus,this.contactDetailsList[2])
      }
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
  adminOfficerDetails: any = null;
  technicalOfficerDetails: any = null;
  billingOfficerDetails: any = null;
  async getAdminOfficerDetails(id: number){
    await lastValueFrom(this.contactDetailsService.getAdminOfficerDetailsById(id)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          this.adminOfficerDetails = response.body;
        }
      },error => {
        if(error.status === HttpStatusCode.Unauthorized){
          this.navigateToSessionTimeout();
        }
      }
    )
  }

  async getTechnicalOfficerDetails(id: number){
    await lastValueFrom(this.contactDetailsService.getTechnicalOfficerDetailsById(id)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          this.technicalOfficerDetails = response.body;
        }
      },error => {
        if(error.status === HttpStatusCode.Unauthorized){
          this.navigateToSessionTimeout();
        }
      }
    )
  }

  async getBillingOfficerDetails(id: number){
    await lastValueFrom(this.contactDetailsService.getBillingOfficerDetailsById(id)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          this.billingOfficerDetails = response.body;
        }
      },error => {
        if(error.status === HttpStatusCode.Unauthorized){
          this.navigateToSessionTimeout();
        }
      }
    )
  }

 

}
