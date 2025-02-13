import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../user/service/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContactDetailsFormService } from '../contact-details-form/service/contact-details-form.service';
import { OrganisationDetailsService } from '../organisation-details/service/organisation-details.service';
import { ContactDocumentUploadService } from '../contact-document-upload/service/contact-document-upload.service';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import * as bootstrap from 'bootstrap';
import { ContactDetailsFormComponent } from '../contact-details-form/contact-details-form.component';
import { DocumentUploadComponent } from '../document-upload/document-upload.component';
import { error } from 'jquery';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-rgnt-officer-details-mgmt',
  templateUrl: './rgnt-officer-details-mgmt.component.html',
  styleUrls: ['./rgnt-officer-details-mgmt.component.css']
})
export class RgntOfficerDetailsMgmtComponent implements OnInit{

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
  // organisationId = localStorage.getItem('organisationId');
  organisationId:any=0;
  myForm: any;

  constructor(private userService: UserService, private router: Router,
    private toastr: ToastrService, private organisationService: OrganisationDetailsService,
    private contactDetailsService: ContactDetailsFormService,
    private contactDocumentsService: ContactDocumentUploadService
  ) {
    this.usersDataSource = new MatTableDataSource<any>();
  }
  // ngAfterViewInit(): void {
  //   throw new Error('Method not implemented.');
  // }
    
  organisationsList: any[] = [];
  async getOrganisations(){
    await lastValueFrom(this.organisationService.getAllOrganisations()).then(
      response => {
        console.log(this.organisationsList);
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

  async getUserById(id: number, contactRole: string) {
    console.log('Role passed:', contactRole);  // Debugging line
    if (contactRole === 'AdminOfficer') {
      this.getAdminOfficerDetails(id);
      console.log(contactRole);
    } else if (contactRole === 'TechnicalOfficer') {
      await this.getTechnicalOfficerDetails(id);
    } else {
      await this.getBillingOfficerDetails(id);
    }
  }
  

  loggedInUser: any;
  async getLoggedInUserDetails(){
   await lastValueFrom(this.userService.getUserByEmailId(this.userId)).then(
    response => {
      if(response.status === HttpStatusCode.Ok){
        this.loggedInUser = response.body;
        this.organisationId=this.loggedInUser.organisationId;
        this.selectedOrganisationId =this.organisationId;
        this.getContactOfficersDetails(parseInt(this.organisationId));
      }
    },error => {
      if(error.status === HttpStatusCode.Unauthorized){
        this.navigateToSessionTimeout();
      }
    }
   )
  }

  @ViewChild(ContactDetailsFormComponent) contactDetailsForm: ContactDetailsFormComponent;
 resetForm() {
    if ( this.contactDetailsForm) {
      this.contactDetailsForm.resetForm();
   
    }
  }

  async ngOnInit(): Promise<void> {
    // this.selectedOrganisationId =parseInt(localStorage.getItem('organisationId'));
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
        'verifyEmail',
        'documents',
        //'approveOrReject',
        'loginStatus',
        // 'actions'
      ]; 
    //}

    await this.getOrganisations();

    this.getLoggedInUserDetails();
    
    // if(this.role === 'IDRBTADMIN'){
    //   await this.getContactOfficersDetails(0);
    // }else if(this.role != 'IDRBTADMIN' && parseInt(this.organisationId) > 0){
      // await this.getContactOfficersDetails(parseInt(this.organisationId));
    //}

  }

  async getContactUsers(){
    //if(this.selectedOrganisation < 1){
      await this.getContactOfficersDetails(this.selectedOrganisation);
      this.validateAddUser();
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
  officerDetails:any=null;
  async getAdminOfficerDetails(id: number){
  
    await lastValueFrom(this.contactDetailsService.getAdminOfficerDetailsById(id)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          this.adminOfficerDetails = response.body;
          console.log(this.adminOfficerDetails)
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
          console.log(this.technicalOfficerDetails)
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
  
  updateMessage: string = '';
  async updateAdminOfficerLoginStatus(adminOfficerDetails: any) {
    this.AdminOrganisationNameChange();
    this.AdminPersonNameChange();
    this.AdminDesignationNameChange();
    this.AdminMobileNameChange();
    this.AdminEmailNameChange();
    console.log('Sending Admin Details:', adminOfficerDetails);  
    if (this.orgNameInput && this.personNameInput && this.designationNameInput && this.mobileNameInput && this.emailNameInput){

    try {
      const response = await lastValueFrom(this.contactDetailsService.updateAdminDetails(adminOfficerDetails));

      if (response.status === HttpStatusCode.Ok) {
        this.updateMessage = 'Admin Officer details updated successfully!';
        console.log('Admin Officer details updated:', response);
        this.toastr.success(' updated successfully');
        this.resetForm();
       window.location.reload();
      } else {
        this.updateMessage = 'Failed to update admin officer details.';
        console.log('Failed to update:', response.status);
      }
    } catch (error) {
      console.error('Error updating admin officer:', error);
      this.updateMessage = 'An error occurred while updating details.';
    }
  }}

  clearButton() {
    this.resetForm();
    document.getElementById('closeRegForm').click();

  }
  cancelButton(){
    this.resetForm();
    document.getElementById('closeRegForm2').click();
  }
  clearButtons() {
    this.resetForm();
    document.getElementById('closeRegForm1').click();

  }

  // resetForm() {
  //   this.orgNameInput = true;
  //   this.personNameInput = true;
  //   this.designationNameInput = true;
  //   this.mobileNameInput = true;
  //   this.emailNameInput = true;
  
   
  //   this.orgNameErrorMessage = '';
  //   this.personNameErrorMessage = '';
  //   this.designationNameErrorMessage = '';
  //   this.mobileNameErrorMessage = '';
  //   this.emailNameErrorMessage = '';
  // }


  
  async updateTechnicalOfficerLoginStatus(techDetails: any) {
    this.organisationNameChange();
this.personNameChange();
this.designationNameChange();
this.mobileNameChange();
this.emailNameChange();
    
    console.log("data")
    if (this.orgNameInput && this.personNameInput && this.designationNameInput && this.mobileNameInput && this.emailNameInput){
    try {
      const response = await lastValueFrom(this.contactDetailsService.updateTechDetails(techDetails));
      if (response.status === HttpStatusCode.Ok) {
        // If the response is successful, reload the page or handle the response accordingly
        console.log(response);
        this.toastr.success(' updated successfully');
        this.resetForm();
        window.location.reload();
      }
    } catch (error) {
      // Handle any errors that occur during the update request
      console.error('Error updating technical officer details', error);
    }
  }
  
  }

  async updateBillingOfficerLoginStatus(billDetails: any){
    this.billingOrganisationNameChange();
    this.billingPersonNameChange();
    this.billingdesignationNameChange();
    this.billingMobileNameChange();
    this.billingEmailNameChange();
    if (this.orgNameInput && this.personNameInput && this.designationNameInput && this.mobileNameInput && this.emailNameInput){
    await lastValueFrom(this.contactDetailsService.updateBillDetails(billDetails)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
         // this.getContactOfficersDetails(response.body.organisationId);
         console.log(response);
         this.toastr.success(' updated successfully');
         this.resetForm();
         window.location.reload();
        }
      }
    )
  }
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
          // if(this.role === 'IDRBTADMIN'){
          //    this.getContactOfficersDetails(0);
          // }else if(this.role != 'IDRBTADMIN' && parseInt(this.organisationId) > 0){
             this.getContactOfficersDetails(parseInt(this.organisationId));
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

  /**
   * 
   * @param user 
   */
  navigateToVerifyDocuments(user: any){
    var contactUserType = '';
    if(user.contactRole === 'Administrative Officer'){
      contactUserType = 'Administrative';
    }else if(user.contactRole === 'Technical Officer'){
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

  userInActiveMap: Map<string, boolean> = new Map();
  options: { key: string, value: boolean }[] = [];
  selectedOfficerToAdd : string = '';
  selectedOrganisationId: number = 0;

  adminDocDetails :any
  techDocDetails :any 
  billDocDetails :any 
  orgDocDetails :any 

  SubmittedAdminDocs(adminDocs) {
    console.log(adminDocs)
    this.adminDocDetails=adminDocs
   }
   submittedTechDocDetails(techDocs){
     console.log(techDocs)
     this.techDocDetails=techDocs
   }
   submittedBillDocDetails(billDocs){
     console.log(billDocs)
     this.billDocDetails=billDocs
   }
   SubmittedOrgDocs(orgDoc){
     console.log(orgDoc);
     this.orgDocDetails=orgDoc;
   }

   /**
   * 
   */
  validateAddUser(){
    console.log(this.contactDetailsList)

       this.contactDetailsList.forEach(contactUser => {
        if(contactUser.isActive === false){
          this.userInActiveMap.set(contactUser.contactRole, contactUser.isActive); 
        }
       });
       this.options = Array.from(this.userInActiveMap, ([key, value]) => ({ key, value }));
       console.log(this.userInActiveMap)
  }
  async getUsersList(organisationId: number) {
    console.log('Organisation ID:', organisationId);
    if (isNaN(organisationId) || organisationId <= 1) {
      console.error('Invalid organisationId:', organisationId);
      //return;
    }
  }

  deleteAdminById(id: number, contactRole: string) {
    const confirmation = window.confirm('Are you sure you want to delete this data?');
    
    if (confirmation) {
      this.userService.deleteAdminById(id, contactRole).subscribe({
        next: (res) => {
          if (res.status === HttpStatusCode.NoContent) {
            this.toastr.success('Data deleted successfully');
            window.location.reload();
          } else {
            this.toastr.error('Failed to delete data');
          }
        },
        error: (err) => {
          console.error('Error deleting data:', err);
          this.toastr.error('An error occurred while deleting data');
        },
      });
    } else {
      this.toastr.info('Data deletion cancelled');
    }
  }
  deleteBillingById(id: number, contactRole: string) {
    const confirmation = window.confirm('Are you sure you want to delete this data?');
    
    if (confirmation) {
      this.userService.deleteBillById(id, contactRole).subscribe({
        next: (res) => {
          if (res.status === HttpStatusCode.NoContent) {
            this.toastr.success('Data deleted successfully');
            window.location.reload();
          } else {
            this.toastr.error('Failed to delete data');
          }
        },
        error: (err) => {
          console.error('Error deleting data:', err);
          this.toastr.error('An error occurred while deleting data');
        },
      });
    } else {
      this.toastr.info('Data deletion cancelled');
    }
  }
 
  deleteTechById(id: number, contactRole: string) {
    const confirmation = window.confirm('Are you sure you want to delete this data?');
    
    if (confirmation) {
      this.userService.deleteTechById(id, contactRole).subscribe({
        next: (res) => {
          if (res.status === HttpStatusCode.NoContent) {
            this.toastr.success('Data deleted successfully');
            window.location.reload();
          } else {
            this.toastr.error('Failed to delete data');
          }
        },
        error: (err) => {
          console.error('Error deleting data:', err);
          this.toastr.error('An error occurred while deleting data');
        },
      });
    } else {
      this.toastr.info('Data deletion cancelled');
    }
  }

  orgNameInput: boolean = true;
  orgNameErrorMessage: string = '';
  isValidOrgName: boolean = false;
  
  organisationNameChange() {
    const orgName = this.technicalOfficerDetails.organisationName;
  
    if (!orgName) {
      this.orgNameInput = false;
      this.orgNameErrorMessage = 'Please enter organisation name to save';
      this.isValidOrgName = false; // Validation failed
    } else if (orgName.length <= 3) {
      this.orgNameInput = false;
      this.orgNameErrorMessage = 'Organisation name should be a minimum of 3 characters to save';
      this.isValidOrgName = false; // Validation failed
    } else {
      this.orgNameInput = true;
      this.orgNameErrorMessage = '';
      this.isValidOrgName = true; // Validation passed
    }
  }
  billingOrganisationNameChange(){
    const orgName = this.billingOfficerDetails.organisationName;
  
    if (!orgName) {
      this.orgNameInput = false;
      this.orgNameErrorMessage = 'Please enter organisation name to save';
      this.isValidOrgName = false; // Validation failed
    } else if (orgName.length <= 3) {
      this.orgNameInput = false;
      this.orgNameErrorMessage = 'Organisation name should be a minimum of 3 characters to save';
      this.isValidOrgName = false; // Validation failed
    } else {
      this.orgNameInput = true;
      this.orgNameErrorMessage = '';
      this.isValidOrgName = true; // Validation passed
    }
  }

  AdminOrganisationNameChange(){
    const orgName = this.adminOfficerDetails.organisationName;
  
    if (!orgName) {
      this.orgNameInput = false;
      this.orgNameErrorMessage = 'Please enter organisation name to save';
      this.isValidOrgName = false; // Validation failed
    } else if (orgName.length <= 3) {
      this.orgNameInput = false;
      this.orgNameErrorMessage = 'Organisation name should be a minimum of 3 characters to save';
      this.isValidOrgName = false; // Validation failed
    } else {
      this.orgNameInput = true;
      this.orgNameErrorMessage = '';
      this.isValidOrgName = true; // Validation passed
    }
  }

  personNameInput: boolean = true;
  personNameErrorMessage: string = '';
  isValidPersonName: boolean = false;
  personNameChange() {
    const personName = this.technicalOfficerDetails.techFullName?.trim(); // Trim spaces from the input
  
    // Check if the person name is empty
    if (!personName) {
      this.personNameInput = false;
      this.personNameErrorMessage = 'Please enter person name to save';
      this.isValidPersonName = false; // Validation failed
    }
    // Check if the person name has less than or equal to 3 characters
    else if (personName.length <= 3) {
      this.personNameInput = false;
      this.personNameErrorMessage = 'Person name should be a minimum of 3 characters to save';
      this.isValidPersonName = false; // Validation failed
    } else {
      // If person name is valid (not empty and more than 3 characters)
      this.personNameInput = true;
      this.personNameErrorMessage = '';
      this.isValidPersonName = true; // Validation passed
    }
  }
  
  billingPersonNameChange(){
    const personName = this.billingOfficerDetails.billFullName?.trim(); // Trim spaces from the input
  
    // Check if the person name is empty
    if (!personName) {
      this.personNameInput = false;
      this.personNameErrorMessage = 'Please enter person name to save';
      this.isValidPersonName = false; // Validation failed
    }
    // Check if the person name has less than or equal to 3 characters
    else if (personName.length <= 3) {
      this.personNameInput = false;
      this.personNameErrorMessage = 'Person name should be a minimum of 3 characters to save';
      this.isValidPersonName = false; // Validation failed
    } else {
      // If person name is valid (not empty and more than 3 characters)
      this.personNameInput = true;
      this.personNameErrorMessage = '';
      this.isValidPersonName = true; // Validation passed
    }
  }

  AdminPersonNameChange(){
    const personName = this.adminOfficerDetails.adminFullName?.trim(); // Trim spaces from the input
  
    // Check if the person name is empty
    if (!personName) {
      this.personNameInput = false;
      this.personNameErrorMessage = 'Please enter person name to save';
      this.isValidPersonName = false; // Validation failed
    }
    // Check if the person name has less than or equal to 3 characters
    else if (personName.length <= 3) {
      this.personNameInput = false;
      this.personNameErrorMessage = 'Person name should be a minimum of 3 characters to save';
      this.isValidPersonName = false; // Validation failed
    } else {
      // If person name is valid (not empty and more than 3 characters)
      this.personNameInput = true;
      this.personNameErrorMessage = '';
      this.isValidPersonName = true; // Validation passed
    }
  }


  designationNameInput: boolean = true;
  designationNameErrorMessage: string = '';
  isValidDesignationName: boolean = false;

  designationNameChange() {
    const desName = this.technicalOfficerDetails.techDesignation?.trim(); // Trim the input to remove leading/trailing spaces
  
    // Check if designation name is empty
    if (!desName) {
      this.designationNameInput = false;
      this.designationNameErrorMessage = 'Please enter designation name to save';
      this.isValidDesignationName = false; // Validation failed
    }
    // Check if designation name length is less than or equal to 3
    else if (desName.length <= 3) {
      this.designationNameInput = false;
      this.designationNameErrorMessage = 'Designation name should be a minimum of 3 characters to save';
      this.isValidDesignationName = false; // Validation failed
    } else {
      // If the input is valid (non-empty, and length greater than 3)
      this.designationNameInput = true;
      this.designationNameErrorMessage = '';
      this.isValidDesignationName = true; // Validation passed
    }
  }
  
  billingdesignationNameChange(){
    const desName = this.billingOfficerDetails.billDesignation?.trim(); // Trim the input to remove leading/trailing spaces
  
    // Check if designation name is empty
    if (!desName) {
      this.designationNameInput = false;
      this.designationNameErrorMessage = 'Please enter designation name to save';
      this.isValidDesignationName = false; // Validation failed
    }
    // Check if designation name length is less than or equal to 3
    else if (desName.length <= 3) {
      this.designationNameInput = false;
      this.designationNameErrorMessage = 'Designation name should be a minimum of 3 characters to save';
      this.isValidDesignationName = false; // Validation failed
    } else {
      // If the input is valid (non-empty, and length greater than 3)
      this.designationNameInput = true;
      this.designationNameErrorMessage = '';
      this.isValidDesignationName = true; // Validation passed
    }
  }

  AdminDesignationNameChange(){
    const desName = this.adminOfficerDetails.adminDesignation?.trim(); // Trim the input to remove leading/trailing spaces
  
    // Check if designation name is empty
    if (!desName) {
      this.designationNameInput = false;
      this.designationNameErrorMessage = 'Please enter designation name to save';
      this.isValidDesignationName = false; // Validation failed
    }
    // Check if designation name length is less than or equal to 3
    else if (desName.length <= 3) {
      this.designationNameInput = false;
      this.designationNameErrorMessage = 'Designation name should be a minimum of 3 characters to save';
      this.isValidDesignationName = false; // Validation failed
    } else {
      // If the input is valid (non-empty, and length greater than 3)
      this.designationNameInput = true;
      this.designationNameErrorMessage = '';
      this.isValidDesignationName = true; // Validation passed
    }
  }

  mobileNameInput: boolean = true;
  mobileNameErrorMessage: string = '';
  isValidMobileName: boolean = false;

  mobileNameChange() {
    const mobileName = this.technicalOfficerDetails.techPhone;
  
    // Check if the mobile number is empty
    if (!mobileName) {
      this.mobileNameInput = false;
      this.mobileNameErrorMessage = 'Please enter mobile number to save';
      this.isValidMobileName = false;
    }
    // Check if the mobile number has exactly 10 digits
    else if (!/^\d{10}$/.test(mobileName)) {
      this.mobileNameInput = false;
      this.mobileNameErrorMessage = 'Mobile number should be exactly 10 digits';
      this.isValidMobileName = false;
    } else {
      // If valid mobile number (exactly 10 digits)
      this.mobileNameInput = true;
      this.mobileNameErrorMessage = '';
      this.isValidMobileName = true;
    }
  }
  billingMobileNameChange(){
    const mobileName = this.billingOfficerDetails.billPhone;
  
    // Check if the mobile number is empty
    if (!mobileName) {
      this.mobileNameInput = false;
      this.mobileNameErrorMessage = 'Please enter mobile number to save';
      this.isValidMobileName = false;
    }
    // Check if the mobile number has exactly 10 digits
    else if (!/^\d{10}$/.test(mobileName)) {
      this.mobileNameInput = false;
      this.mobileNameErrorMessage = 'Mobile number should be exactly 10 digits';
      this.isValidMobileName = false;
    } else {
      // If valid mobile number (exactly 10 digits)
      this.mobileNameInput = true;
      this.mobileNameErrorMessage = '';
      this.isValidMobileName = true;
    }
  }
  AdminMobileNameChange(){
    const mobileName = this.adminOfficerDetails.adminPhone;
  
    // Check if the mobile number is empty
    if (!mobileName) {
      this.mobileNameInput = false;
      this.mobileNameErrorMessage = 'Please enter mobile number to save';
      this.isValidMobileName = false;
    }
    // Check if the mobile number has exactly 10 digits
    else if (!/^\d{10}$/.test(mobileName)) {
      this.mobileNameInput = false;
      this.mobileNameErrorMessage = 'Mobile number should be exactly 10 digits';
      this.isValidMobileName = false;
    } else {
      // If valid mobile number (exactly 10 digits)
      this.mobileNameInput = true;
      this.mobileNameErrorMessage = '';
      this.isValidMobileName = true;
    }
  }


  emailNameInput: boolean = true;
  emailNameErrorMessage: string = '';
  isValidemailName: boolean = false;
  emailNameChange() {
    const email = this.technicalOfficerDetails.techEmail;
  
    // Check if email is empty
    if (!email) {
      this.emailNameInput = false;
      this.emailNameErrorMessage = 'Please enter email to save';
      this.isValidemailName = false;
    }
    // Check if email matches the correct email pattern (basic email validation)
    else if (!this.isValidEmailFormat(email)) {
      this.emailNameInput = false;
      this.emailNameErrorMessage = 'Please enter a valid email address to save';
      this.isValidemailName = false;
    } else {
      // If email is valid
      this.emailNameInput = true;
      this.emailNameErrorMessage = '';
      this.isValidemailName = true;
    }
  }
  
  billingEmailNameChange(){
    const email = this.billingOfficerDetails.billEmail;
  
    // Check if email is empty
    if (!email) {
      this.emailNameInput = false;
      this.emailNameErrorMessage = 'Please enter email to save';
      this.isValidemailName = false;
    }
    // Check if email matches the correct email pattern (basic email validation)
    else if (!this.isValidEmailFormat(email)) {
      this.emailNameInput = false;
      this.emailNameErrorMessage = 'Please enter a valid email address to save';
      this.isValidemailName = false;
    } else {
      // If email is valid
      this.emailNameInput = true;
      this.emailNameErrorMessage = '';
      this.isValidemailName = true;
    }
  }
  AdminEmailNameChange(){
    const email = this.adminOfficerDetails.adminEmail;
  
    // Check if email is empty
    if (!email) {
      this.emailNameInput = false;
      this.emailNameErrorMessage = 'Please enter email to save';
      this.isValidemailName = false;
    }
    // Check if email matches the correct email pattern (basic email validation)
    else if (!this.isValidEmailFormat(email)) {
      this.emailNameInput = false;
      this.emailNameErrorMessage = 'Please enter a valid email address to save';
      this.isValidemailName = false;
    } else {
      // If email is valid
      this.emailNameInput = true;
      this.emailNameErrorMessage = '';
      this.isValidemailName = true;
    }
  }


  // Helper function to validate the email format
  isValidEmailFormat(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }


  userObjForEmailVerify:any
  sendOtpToVerifyEmail(user){
    this.organisationService.sendOtpForVerifyingOfficers(user.contactRole,user.emailId).subscribe({
      next:(response)=>{
        this.toastr.success("OTP sent to verify the email");
        this.startTimer();
        this.userObjForEmailVerify=user;
        document.getElementById("OtpVerifyEmail").click();
       
        
      },error:(error)=>{
        if(error.status===HttpStatusCode.Unauthorized){
          this.navigateToSessionTimeout();
        }
      }
    })
  }
  otpValidation(event:KeyboardEvent){
    // this.OtpResponseMessage=''
    const invalidChars =['+','-','.','e'];
    const inputElement= event.target as HTMLInputElement;
    if(invalidChars.includes(event.key)|| (inputElement.value.length==6 && event.key!='Backspace')||event.keyCode===40||event.keyCode===38)
    {
        // this.verifyButtonDisabled=false;
        event.preventDefault();
    }
  }
  display: string;
  resetTimer() {
    this.pauseTimer();
    this.time =300;
    this.display = this.transform(this.time);
  }
  time: number = 300; // 120 seconds = 2 minutes
  
  interval;
  startTimer() {
    this.interval = setInterval(() => {
      if (this.time > 0) {
        this.time--;
        this.display = this.transform(this.time);
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
    this.display = this.transform(this.time);
  }
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    const seconds: number = value - minutes * 60;
    const formattedMinutes: string = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds: string = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return formattedMinutes + ':' + formattedSeconds;
  }
  
  /**
   * Pause the timer
   */
  pauseTimer() {
    clearInterval(this.interval);
  }
 timerDisplay: string = environment.otpExpiryTimeDisplay;
  timerActive: boolean = true;
  private countdown: any;
  private remainingTime: number = environment.otpExpiryTime; 
  otpExpired: boolean = false;
  initialTime = environment.otpExpiryTime;
  errorMessage: string = '';
  successMessage: string = '';
  otp:number;
  verifyOtp() {
      console.log('Starting OTP verification...');
      
      // Step 1: Check if OTP has expired
      if (this.otpExpired) {
        this.toastr.error('OTP has expired. Please request a new one.');
        return;
      }
    
      // Step 2: Check if email or OTP is missing
      if ( !this.otp) {
        console.log('Error: Email or OTP is missing');
        this.toastr.error('Please enter OTP.');
        this.errorMessage = 'Please enter  OTP.';
        this.successMessage = '';
        return;
      }
    
      console.log('Verifying OTP for User ID:', this.user.userId);
      console.log('Entered OTP:', this.otp);
    
      // Step 3: Call backend to verify OTP
      this.organisationService.verifyOtpForEmailVerification(this.userObjForEmailVerify.emailId, this.otp,this.userObjForEmailVerify.contactRole).subscribe({
        next: (response) => {
          console.log('OTP verification response:', response);
    
          // Check if the response is valid
          if (response.body === true) {  // Backend returns true if OTP matches
            console.log('OTP verification successful');
            this.toastr.success("OTP verification successful");
            this.successMessage = 'OTP verified successfully!';
            this.errorMessage = '';
            
            this.resetTimer();
            // this.startTimer();
            this.otpExpired = true; // OTP is expired after verification
    
            // Close the registration form/modal
            document.getElementById('closeRegForm')?.click();
          
          } else {
            // OTP verification failed
            console.log('Invalid OTP, response:', response);
            this.toastr.error('Invalid OTP. Please try again.');
            this.successMessage = '';
            this.errorMessage = 'Invalid OTP. Please enter the correct OTP.';
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log('Error during OTP verification:', error);
    
          if (error.status === 401) {
            console.log("otp expired")
            // If the OTP is expired
            this.toastr.error('OTP has expired. Please request a new one.');
            this.successMessage = '';
            this.errorMessage = 'OTP has expired. Please request a new OTP.';
            if (this.errorMessage.includes('OTP expired')) {
              this.otpExpired = true; // Mark OTP as expired
            }
          } else {
            // Other errors
            this.toastr.error('Failed to verify OTP. Please try again.');
            this.successMessage = '';
            this.errorMessage = 'Error occurred while verifying OTP.';
          }
        }
      });
    }
    
    otpResentMessage: string = '';

    resendOtp(): void {
      this.organisationService.sendOtpForVerifyingOfficers(this.userObjForEmailVerify.contactRole,this.userObjForEmailVerify.emailId).subscribe({
        next:(response)=>{
          this.toastr.success("OTP sent to verify the email");
          this.startTimer();
          // this.userObjForEmailVerify=user;
          // document.getElementById("OtpVerifyEmail").click();
         
          
        },error:(error)=>{
          if(error.status===HttpStatusCode.Unauthorized){
            this.navigateToSessionTimeout();
          }
        }
      })
    }

}
