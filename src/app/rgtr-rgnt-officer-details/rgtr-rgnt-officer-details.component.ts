import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../user/service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrganisationDetailsService } from '../organisation-details/service/organisation-details.service';
import { lastValueFrom } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { ContactDetailsFormService } from '../contact-details-form/service/contact-details-form.service';
import { ContactDocumentUploadService } from '../contact-document-upload/service/contact-document-upload.service';
import { Roles } from '../model/roles.model';
import { RolesService } from '../roles/services/roles.service';

@Component({
  selector: 'app-rgtr-rgnt-officer-details',
  templateUrl: './rgtr-rgnt-officer-details.component.html',
  styleUrls: ['./rgtr-rgnt-officer-details.component.css']
})
export class RgtrRgntOfficerDetailsComponent {

   selectedOrganisationId: number = 0;
    // roles:Roles=new Roles();
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
      private contactDetailsService: ContactDetailsFormService,private roleService:RolesService,
      private contactDocumentsService: ContactDocumentUploadService,private route:ActivatedRoute
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
      // console.log(typeof(this.route.snapshot.queryParams['data']))
      this.getAllRoles();
      this.selectedOrganisationId=this.route.snapshot.queryParams['data']?Number(this.route.snapshot.queryParams['data']):0;
      if(this.route.snapshot.queryParams['data']){
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {}, // Clear query params
          replaceUrl: true, // Replace the URL in the browser history
        });
      }
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
          'loginStatus',
          'isActive',
          'actions'
        ]; 
      //}
     
      await this.getOrganisations();
  
      this.getLoggedInUserDetails();
      
      //if(this.role === 'IDRBTADMIN'){
        await this.getContactOfficersDetails(this.selectedOrganisationId);
      //}else if(this.role != 'IDRBTADMIN' && parseInt(this.organisationId) > 0){
        //await this.getContactOfficersDetails(parseInt(this.organisationId));
      //}
  
    }
  
    async getContactUsers(){
      //if(this.selectedOrganisation < 1){
      console.log(this.selectedOrganisationId)
      if(this.selectedOrganisationId===null){
        this.selectedOrganisationId=0
      }
        await this.getContactOfficersDetails(this.selectedOrganisationId);
        if(this.selectedOrganisationId === 0){
          this.userInActiveMap = new Map();
        }else{
          this.validateAddUser();
        }
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
      this.user.userRoles = null;
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
    async enableOrDisableLoginStatus(loginStatus: string, contactOfficerDetails: any){
      console.log(contactOfficerDetails.id)
      //first update the login status of contact officer and then create the user login for the contact officer
      if(contactOfficerDetails.contactRole === 'Administrative Officer'){
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
          this.adminOfficerDetails.isActive = true;
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
      this.user.createdByEmailId = this.userId;
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
            contactUserType: contactUserType,
            email:user.emailId
          }})
    }
  
  
    userInActiveMap: Map<string, boolean> = new Map();
    options: { key: string, value: boolean }[] = [];
    selectedOfficerToAdd : string = '';
  
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
       if(this.selectedOrganisationId === 0){
         this.toastr.error('Please select a Bank/Organisation')
       }else{
         this.contactDetailsList.forEach(contactUser => {
          if(contactUser.isActive === false){
            this.userInActiveMap.set(contactUser.contactRole, contactUser.isActive); 
          }
         });
         this.options = Array.from(this.userInActiveMap, ([key, value]) => ({ key, value }));
         console.log(this.userInActiveMap)
       }
    }
  
    /**
     * 
     * @param id 
     */
    async getUserById(id: number, contactRole: string){
      if(contactRole === 'Administrative Officer'){
        this.getAdminOfficerDetails(id);
      }else if(contactRole === 'Technical Officer'){
        await this.getTechnicalOfficerDetails(id);
      }else{
        await this.getBillingOfficerDetails(id);
      }
    }
    
    async getContactOfficerById(id: number){
  
    }
  
    searchText: string = '';
   
    applyFilter() {
      this.usersDataSource.filter = this.searchText.trim().toLowerCase(); // Filters based on search text
  
      if (this.usersDataSource.paginator) {
        this.usersDataSource.paginator.firstPage(); // Reset paginator to the first page after filtering
      }
    }

}
