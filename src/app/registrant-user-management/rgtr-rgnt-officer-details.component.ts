import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../user/service/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrganisationDetailsService } from '../organisation-details/service/organisation-details.service';
import { lastValueFrom } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { ContactDetailsFormService } from '../contact-details-form/service/contact-details-form.service';
import { ContactDocumentUploadService } from '../contact-document-upload/service/contact-document-upload.service';

@Component({
  selector: 'app-rgtr-rgnt-officer-details',
  templateUrl: './rgtr-rgnt-officer-details.component.html',
  styleUrls: ['./rgtr-rgnt-officer-details.component.css']
})
export class RgtrRgntOfficerDetailsComponent {

  selectedOrganisation: number = 0;

  user = {
    id: 0,
    userName: '',
    userId: '',
    role: '',
    active: false,
    encryptedPassword: '',
    mobileNumber: '',
    confirmPassword: '',
    createdByEmailId:'',
    organisationId:0,
    organisationDetails: {},
    isOnboardingCompleted: false
  }


  showEmailButton: boolean = false;
  showNumberButton: boolean = false;
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  //isToggleOn: boolean = false;

  displayedColumns: string[] = [];// Matches matColumnDef values

  usersList: any[];
  usersDataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  userId = localStorage.getItem('email');
  role = localStorage.getItem('userRole');
  organisationId = localStorage.getItem('organisationId');

  constructor(private userService: UserService, private router: Router,
    private toastr: ToastrService, private organisationService: OrganisationDetailsService,
    private contactDetailsService: ContactDetailsFormService,
    private contactDocumentsService: ContactDocumentUploadService
  ) {
    this.usersDataSource = new MatTableDataSource<any>();
  }
    
  organisationsList: any[] = [];
  async getOrganisations(){
    await lastValueFrom(this.organisationService.getAllOrganisations()).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          this.organisationsList = response.body;
        }
      }, error => {
        if(error.status === HttpStatusCode.Unauthorized){
          this.navigateToSessionTimeout();
        }
      }
    )
  }

  loggedInUser: any;
  async getLoggedInUserDetails(){
   await lastValueFrom(this.userService.getUserByEmailId(this.userId)).then(
    response => {
      if(response.status === HttpStatusCode.Ok){
        this.loggedInUser = response.body;
        console.log(this.loggedInUser)
      }
    },error => {
      if(error.status === HttpStatusCode.Unauthorized){
        this.navigateToSessionTimeout();
      }
    }
   )
  }

  async ngOnInit(): Promise<void> {
    //set table comumns based on role
    //if(this.role === 'IDRBTADMIN'){
      this.displayedColumns = [
        //'checkbox',
        'id',
        'organisationName',
        'personName',
        'designation',
        'mobileNumber',
        'emailId',
        'contactRole',
        'documents',
        'approveOrReject',
        'loginStatus'
      ]; 
    //}

    await this.getOrganisations();

    this.getLoggedInUserDetails();
    
    if(this.role === 'IDRBTADMIN'){
      await this.getContactOfficersDetails(0);
    }else if(this.role != 'IDRBTADMIN' && parseInt(this.organisationId) > 0){
      await this.getContactOfficersDetails(parseInt(this.organisationId));
    }

  }

  async getContactUsers(){
    //if(this.selectedOrganisation < 1){
      await this.getContactOfficersDetails(this.selectedOrganisation);
    //}
  }

  contactDetailsList: any[] = [];
  async getContactOfficersDetails(selectedOrganisationId: number){
    await lastValueFrom(this.contactDetailsService.getContactOfficersDetails(selectedOrganisationId)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          console.log(response.body);
          this.contactDetailsList = response.body;
          this.usersDataSource.data = this.contactDetailsList;
          this.usersDataSource.paginator = this.paginator;
          console.log(this.sort)
          setTimeout(() => {
            this.usersDataSource.sort = this.sort;
            console.log(this.sort)
            console.log(this.usersDataSource.sort);
          }, 0);
        }
      },error => {
        if(error.status === HttpStatusCode.Unauthorized){
          this.navigateToSessionTimeout();
        }
      }
    )
  }

  // async getUsersList(organisationId: number) {
  //   console.log('Organisation ID:', organisationId);
  //   if (isNaN(organisationId) || organisationId <= 1) {
  //     console.error('Invalid organisationId:', organisationId);
  //     //return;
  //   }
  //   await lastValueFrom(this.userService.getAllUsers(organisationId)).then(
  //     (response) => {
  //       if (response.status === HttpStatusCode.Ok) {
  //         console.log(response.body);
  //         this.usersList = response.body;
  //         this.usersDataSource.data = this.usersList;
  //         this.usersDataSource.paginator = this.paginator;
  //         console.log(this.sort)
  //         setTimeout(() => {
  //           this.usersDataSource.sort = this.sort;
  //           console.log(this.sort)
  //           console.log(this.usersDataSource.sort);
  //         }, 0);
  //       }
  //     },
  //     (error) => {
  //       if (error.status === HttpStatusCode.Unauthorized) {
  //         this.navigateToSessionTimeout();
  //       }
  //     }
  //   );
  // }

  navigateToDomainDetails(domainId: number){
    this.router.navigate(['/domain-details'],{queryParams:{domainId:domainId}});
  }

  navigateToSessionTimeout() {
    this.router.navigateByUrl('/session-timeout');
  }

  organisationDetails: any;
  async getOrganisationDetailsOfUser(organisationId: number){
    await lastValueFrom(this.organisationService
      .getOrganisationDetailsByOrganisationId(organisationId)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          this.user.organisationDetails = response.body;
          console.log(this.user);
        }
      },error => {
        if(error.status === HttpStatusCode.Unauthorized){
          this.navigateToSessionTimeout();
        }
      }
    )
  }

  clearData(){
    this.user.id = 0;
    this.user.userName = '';
    this.user.userId = '';
    this.user.role = '';
    this.user.encryptedPassword = '';
    this.user.mobileNumber = '';
    this.user.mobileNumber = '';
    this.user.confirmPassword = '';
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

  documentsList: any[] = [];
  async getContactOfficerDocuments(contactType: string, organisationId: number){
    await lastValueFrom(this.contactDocumentsService.getContactOfficerDocuments(contactType,organisationId)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          this.documentsList = response.body;
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
    //first update the login status of contact officer and then create the user login for the contact officer
    if(contactOfficerDetails.contactRole === 'AdminOfficer'){
      await this.getAdminOfficerDetails(contactOfficerDetails.id);
      //before updating status
      await this.getContactOfficerDocuments("Administrative",this.adminOfficerDetails.organisationId);
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
        await this.updateAdminOfficerLoginStatus(this.adminOfficerDetails);
      }else if(count < 3 && loginStatus === 'Approved'){
        this.toastr.error('Document verification pending.')
        return;
      }else if(count === 3 && loginStatus === 'Rejected'){
        this.adminOfficerDetails.loginStatus = 'Rejected';
        await this.updateAdminOfficerLoginStatus(this.adminOfficerDetails);
      }else if(count < 3 && loginStatus === 'Rejected'){
        this.toastr.error('Document verification pending');
        return;
      }
    }else if(contactOfficerDetails.contactRole === 'TechnicalOfficer'){
      await this.getTechnicalOfficerDetails(contactOfficerDetails.id);
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
        this.technicalOfficerDetails.loginStatus = loginStatus;
        await this.updateTechnicalOfficerLoginStatus(this.technicalOfficerDetails);
      }else{
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
      await this.updateBillingOfficerLoginStatus(this.billingOfficerDetails);
      }else{
        this.toastr.error('Document verification pending');
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
    this.user.role = contactOfficerDetails.contactRole;
    this.user.mobileNumber = contactOfficerDetails.mobileNumber;
    this.user.createdByEmailId = this.userId;
    this.user.organisationId = contactOfficerDetails.organisationId;
    this.user.isOnboardingCompleted = true;
    await lastValueFrom(this.userService.saveUser(this.user)).then(
      response => {
        if(response.status === HttpStatusCode.Created){
          console.log(response);
          this.toastr.success('Login approved');
          if(this.role === 'IDRBTADMIN'){
             this.getContactOfficersDetails(0);
          }else if(this.role != 'IDRBTADMIN' && parseInt(this.organisationId) > 0){
             this.getContactOfficersDetails(parseInt(this.organisationId));
          }
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

  /**
   * 
   * @param user 
   */
  navigateToVerifyDocuments(user: any){
    var contactUserType = '';
    if(user.contactRole === 'AdminOfficer'){
      contactUserType = 'Administrative';
    }else if(user.contactRole === 'TechnicalOfficer'){
      contactUserType = 'Technical';
    }else{
      contactUserType = 'Billing';
    }
    this.router.navigate(['/verify-documents'],
      {
        queryParams:{
          organisationId:user.organisationId,
          contactUserType: contactUserType
        }})
  }

}
