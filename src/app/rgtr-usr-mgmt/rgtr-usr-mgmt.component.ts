import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user/service/user.service';
import { Router } from '@angular/router';
import { OrganisationDetailsService } from '../organisation-details/service/organisation-details.service';
import { lastValueFrom } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { RgtrRoleService } from '../rgtr-role/services/rgtr-role.service';
import { Roles } from '../model/roles.model';
import { RgtrRoles } from '../model/rgtrRole.model';
import { DepartmentService } from '../rgtr-department/service/department.service';
import { RgtrDepartment } from '../model/rgtrDepartment.model';
import { User } from '../model/user.model';
import { RgtrUserService } from './service/rgtr-user.service';
import { error } from 'jquery';

@Component({
  selector: 'app-rgtr-usr-mgmt',
  templateUrl: './rgtr-usr-mgmt.component.html',
  styleUrls: ['./rgtr-usr-mgmt.component.css']
})
export class RgtrUsrMgmtComponent implements OnInit{

  user = {
    id: 0,
    userName: '',
    userId: '',
    userRoles: [{
      roleId:0,
      roleName: '',
      roleDescription: '',
      roleStatus: ''
    }],
    active: false,
    encryptedPassword: '',
    mobileNumber: '',
    confirmPassword: '',
    createdByEmailId:'',
    departmentId:0
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

  constructor(private userService: UserService, private router: Router,private rgtrUserService: RgtrUserService,
    private toastr: ToastrService, private organisationService: OrganisationDetailsService,private rgtrRoleService:RgtrRoleService,private departmentService:DepartmentService
  ) {
    this.usersDataSource = new MatTableDataSource<any>();
    this.updatedUser=new User();
    this.updatedUser.userRoles=[]
    this.updatedUser.userRoles[0]=new Roles();
  }
    
     
  updatedUser:User;
  loggedInUser: any;
  async getLoggedInUserDetails(){
   await lastValueFrom(this.userService.getRgtrUserByEmailId(this.userId)).then(
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
    // //set table comumns based on role
    // if(this.role === 'IDRBTADMIN'){
    //   this.displayedColumns = [
    //     'checkbox',
    //     'id',
    //     'userId',
    //     'userName',
    //     'institutionName',
    //     'role',
    //     'access',
    //     'active',
    //     'actions',
    //   ]; 
    // }else{
      this.displayedColumns = [
        //'checkbox',
        'Sl No',
        'userId',
        'userName',
        'departmentId',
        'userRoles',
        'access',
        'active',
        'edit',
        'delete'
       //'actions',
      ]; 
    //}

    this.getLoggedInUserDetails();
    
    // if(this.role === 'IDRBTADMIN'){
    //   await this.getUsersList(0);
    // }else if(this.role != 'IDRBTADMIN' && parseInt(this.organisationId) > 0){
      await this.getUsersList(0);
      this.getAllRoles();
      this.getAllDepartment();
    //}
    // this.usersList.forEach(user => {
    //   if(user.organisationId > 0){
    //      this.getOrganisationDetailsOfUser(user.organisationId);
    //   }else{
    //      user.organisation.institutionName = 'Onboarding Pending';
    //   }
    // });
    //if(parseInt(this.organisationId) > 0){
      
    //}

  }

  allRoles:RgtrRoles[]
  getAllRoles(){
    this.rgtrRoleService.getAllRoles().subscribe({
      next:(response)=>{
        console.log(response.body)
        this.allRoles=response.body;
      },error:(error)=>{
        console.log(error)
      }
    })
  }
  allDepartment:RgtrDepartment[]
  DepartmentErrorInfo
  getAllDepartment(){
    this.departmentService.getAllDepartments().subscribe({
      next:(response)=>{
        this.allDepartment=response.body;
      },error:(error)=>{
        if (error.status === HttpStatusCode.Unauthorized) {
          this.navigateToSessionTimeout();
        }
      }
    })
  }

  async getUsersList(organisationId: number) {
    console.log('Organisation ID:', organisationId);
    // if (isNaN(organisationId) || organisationId <= 1) {
    //   console.error('Invalid organisationId:', organisationId);
    //   //return;
    // }
    await lastValueFrom(this.userService.getAllRgtrUsers()).then(
      (response) => {
        if (response.status === HttpStatusCode.Ok) {
          console.log(response.body);
          this.usersList = response.body;
          this.usersDataSource.data = this.usersList;
          this.usersDataSource.paginator = this.paginator;
          console.log(this.sort)
          setTimeout(() => {
            this.usersDataSource.sort = this.sort;
            console.log(this.sort)
            console.log(this.usersDataSource.sort);
          }, 0);
        }
      },
      (error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.navigateToSessionTimeout();
        }
      }
    );
  }

  navigateToDomainDetails(domainId: number){
    this.router.navigate(['/domain-details'],{queryParams:{domainId:domainId}});
  }

  navigateToSessionTimeout() {
    this.router.navigateByUrl('/session-timeout');
  }

  toggleState: boolean = false;
  async onAccessToggle(event: any, user: any): Promise<void> {
    this.toggleState = event.checked;
    console.log(this.toggleState);
    user.active = this.toggleState;
    await this.updateUser(user);
  }

 
  async getUserByUserId(email) {
    await lastValueFrom(this.userService.getRgtrUserByEmailId(email)).then(
      response => {
        if (response.status === HttpStatusCode.Ok) {
          this.updatedUser = response.body;
        }
      }, error => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.navigateToSessionTimeout();
        }
      }
    )
  }

  async updateUser(user: any) {
    await lastValueFrom(this.rgtrUserService.updateUser(user)).then(response => {
      if (response.status === HttpStatusCode.PartialContent) {
        this.toastr.success('User updated successfully.')
        document.getElementById("closeTheUpdateModal").click();
        // this.getUsersList(parseInt(this.organisationId));
      }
    }, error => {
      if (error.status === HttpStatusCode.Unauthorized) {
        this.navigateToSessionTimeout();
      }
    }
    )
  }

  async deleteUserById(email) {
    var confirmed = window.confirm('Are you sure, you really want to delete this user ?');
    if (confirmed) {
      await lastValueFrom(this.rgtrUserService.deleteUserByUserId(email)).then(
        response => {
          if (response.status === HttpStatusCode.Ok) {
            // this.getUsersList(parseInt(this.organisationId));
          }
        }, error => {
          if (error.status === HttpStatusCode.Unauthorized) {
            this.navigateToSessionTimeout();
          }
        }
      )
    }else{
      this.toastr.warning('User not deleted')
    }
  }

  formValid() {
    console.log("validation checking");
    return this.nameInput && this.emailInput && this.numberInput && this.passwordNameInput && this.confirmPasswordInput && this.isAuthorized;
  }

  nameErrorMessage: string = '';
  nameInput: boolean = true;
  nameChange() {
    if (!this.user.userName) {
      this.nameInput = false;
      this.nameErrorMessage = 'Name should not be empty.';
    } else if (this.user.userName.length > 25) {
      this.nameInput = false;
      this.nameErrorMessage = 'Name should not exceed 25 characters.';
    } else {
      this.nameInput = true;
      this.nameErrorMessage = '';
    }
  }
  updateName() {
    if (!this.updatedUser.userName) {
      this.nameInput = false;
      this.nameErrorMessage = 'Name should not be empty.';
    } else if (this.updatedUser.userName.length > 25) {
      this.nameInput = false;
      this.nameErrorMessage = 'Name should not exceed 25 characters.';
    } else {
      this.nameInput = true;
      this.nameErrorMessage = '';
    }
  }

  emailInput: boolean = true;
  emailerrorMessage: string = '';
  emailChange() {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
    if (!this.user.userId) {
      this.emailInput = false;
      this.emailerrorMessage = 'Email ID should not be empty';
    } else if (!emailPattern.test(this.user.userId)) {
      this.emailInput = false;
      this.emailerrorMessage = 'Please enter a valid email ID';
    } else {
      this.emailInput = true;
      this.emailerrorMessage = '';
    }
  }
  updateEmailChange() {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
    if (!this.updatedUser.userId) {
      this.emailInput = false;
      this.emailerrorMessage = 'Email ID should not be empty';
    } else if (!emailPattern.test(this.updatedUser.userId)) {
      this.emailInput = false;
      this.emailerrorMessage = 'Please enter a valid email ID';
    } else {
      this.emailInput = true;
      this.emailerrorMessage = '';
    }
  }

  numberInput: boolean = true;
  numbererrorMessage: string = '';
  numberChange() {
    const numberPattern = /^\d{10}$/;
if (!this.user.mobileNumber) {
      this.numberInput = false;
      this.numbererrorMessage = 'Mobile number should not be empty';
    } else if (!numberPattern.test(this.user.mobileNumber)) {
      this.numberInput = false;
      this.numbererrorMessage = 'Please enter a valid mobile number starting with +91 and 10 digits';
    } else {
      this.numberInput = true;
      this.numbererrorMessage = ''; 
    }
  }

  validateuserRole(){

  }

  passwordErrorMessage: string = '';
  passwordNameInput: boolean = true;
  passwordChange() {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*])[A-Za-z\d@!#$%^&*]{8,}/;
    if (!this.user.encryptedPassword) {
      this.passwordNameInput = false;
      this.passwordErrorMessage = 'Password should not be empty';
    } else if (!pattern.test(this.user.encryptedPassword)) {
      this.passwordNameInput = false;
      this.passwordErrorMessage = 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character';
    } else {
      this.passwordNameInput = true;
      this.passwordErrorMessage = '';
    }
  }

  confirmPasswordErrorMessage: string = '';
  confirmPasswordInput: boolean = true;
  confirmPasswordChange() {
    if (!this.user.confirmPassword) {
      this.confirmPasswordInput = false;
      this.confirmPasswordErrorMessage = 'Confirm password should not be empty';
    } else if (this.user.encryptedPassword !== this.user.confirmPassword) {
      this.confirmPasswordInput = false;
      this.confirmPasswordErrorMessage = 'Passwords do not match';
    } else {
      this.confirmPasswordInput = true;
      this.confirmPasswordErrorMessage = '';
    }
  }

  isAuthorized: boolean = false;
  showError: boolean = false;
  validateCheckbox() {
    if (!this.isAuthorized) {
      this.showError = true;
    } else {
      this.showError = false;
    }
  }

  toggleEmailButton() {
    this.showEmailButton = this.user.userId.length > 0;
  }

  toggleNumberButton() {
    this.showNumberButton = this.user.mobileNumber.length > 0;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    const passwordField = document.getElementById('password') as HTMLInputElement;
    passwordField.type = this.isPasswordVisible ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    const confirmPasswordField = document.getElementById('confirmPassword') as HTMLInputElement;
    confirmPasswordField.type = this.isConfirmPasswordVisible ? 'text' : 'password';
  }

  async saveOrUpdateUser(){
   

      await this.saveUser(this.user);
   
  }

  async updateTheChanges(){
    await this.updateUser(this.updatedUser);
  }

selectedRole
getTheRole(role){
  this.selectedRole=role
  console.log(this.selectedRole)
}
  async saveUser(user: any) {
    var id =  localStorage.getItem('email');
    console.log(id,this.selectedRole,this.user.departmentId);
    user.createdByEmailId = this.loggedInUser.userId;
    this.user.userRoles[0].roleId=this.selectedRole.roleId;
    this.user.userRoles[0].roleDescription=this.selectedRole.roleDescription;
    this.user.userRoles[0].roleName=this.selectedRole.roleName;
    this.user.userRoles[0].roleStatus=this.selectedRole.roleStatus;
    user.userRoles[0]=this.user.userRoles[0];
    // user.organisationId = this.organisationId;
    await lastValueFrom(this.userService.saveRgtrUser(user)).then(
      response => {
      if (response.status === HttpStatusCode.Created) {
        this.toastr.success('User added successfully.')
        // this.getUsersList(parseInt(this.organisationId));
      }
    }, error => {
      if (error.status === HttpStatusCode.Unauthorized) {
        this.navigateToSessionTimeout();
      }
    }
    )
  }

  organisationDetails: any;
  // async getOrganisationDetailsOfUser(organisationId: number){
  //   await lastValueFrom(this.organisationService
  //     .getOrganisationDetailsByOrganisationId(organisationId)).then(
  //     response => {
  //       if(response.status === HttpStatusCode.Ok){
  //         this.user.organisationDetails = response.body;
  //         console.log(this.user);
  //       }
  //     },error => {
  //       if(error.status === HttpStatusCode.Unauthorized){
  //         this.navigateToSessionTimeout();
  //       }
  //     }
  //   )
  // }

  clearData(){
    this.user.id = 0;
    this.user.userName = '';
    this.user.userId = '';
    this.user.userRoles = [];
    this.user.encryptedPassword = '';
    this.user.mobileNumber = '';
    this.user.mobileNumber = '';
    this.user.confirmPassword = '';
  }


  /**
   * 
   */
  verifyOnBoardingStatus(){
    console.log(this.loggedInUser.isOnboardingCompleted)
    if(this.loggedInUser.isOnboardingCompleted === false) {
      this.toastr.error('Please complete onbaording to add users.');
      console.log('complete onbaording')
    }else{
      document.getElementById('addUser1').click();
    }
  }
  isEmployeeDepartmentValid:boolean=false
  validateDepartment(){
    if (this.user.departmentId < 1) {
      this.DepartmentErrorInfo = "Department is required."
      this.isEmployeeDepartmentValid = false;

    }
    else {
      this.DepartmentErrorInfo = "";
      this.isEmployeeDepartmentValid = true;
    }
    return this.isEmployeeDepartmentValid;
  }
  searchText: string = '';
  applyFilter() {
    this.usersDataSource.filter = this.searchText.trim().toLowerCase(); // Filters based on search text

    if (this.usersDataSource.paginator) {
      this.usersDataSource.paginator.firstPage(); // Reset paginator to the first page after filtering
    }
  }
}
