import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomainService } from '../domain/service/domain.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { UserService } from './service/user.service';
import { ToastrService } from 'ngx-toastr';
//import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  user = {
    id: 0,
    userName: '',
    userId: '',
    role: '',
    active: false,
    encryptedPassword: '',
    mobileNumber: '',
    confirmPassword: '',
    createdByEmailId:''
  }

  showEmailButton: boolean = false;
  showNumberButton: boolean = false;
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  //isToggleOn: boolean = false;

  displayedColumns: string[] = [
    'checkbox',
    'id',
    'userId',
    'userName',
    'role',
    'access',
    'active',
    'actions',
  ]; // Matches matColumnDef values

  usersList: any[];
  usersDataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private router: Router,
    private toastr: ToastrService
  ) {
    this.usersDataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.getUsersList();
  }

  async getUsersList() {
    await lastValueFrom(this.userService.getAllUsers()).then(
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

  navigateToDomainDetails(domainId: number) {
    this.router.navigate(['/domain-details'], { queryParams: { domainId: domainId } });
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

  //user: any = null;
  async getUserById(id: number) {
    await lastValueFrom(this.userService.getUserById(id)).then(
      response => {
        if (response.status === HttpStatusCode.Ok) {
          this.user = response.body;
        }
      }, error => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.navigateToSessionTimeout();
        }
      }
    )
  }

  async updateUser(user: any) {
    await lastValueFrom(this.userService.updateUser(user)).then(response => {
      if (response.status === HttpStatusCode.PartialContent) {
        this.toastr.success('User updated successfully.')
        this.getUsersList();
      }
    }, error => {
      if (error.status === HttpStatusCode.Unauthorized) {
        this.navigateToSessionTimeout();
      }
    }
    )
  }

  async deleteUserById(id: number) {
    var confirmed = window.confirm('Are you sure, you really want to delete this user ?');
    if (confirmed) {
      await lastValueFrom(this.userService.deleteUserById(id)).then(
        response => {
          if (response.status === HttpStatusCode.Ok) {
            this.getUsersList();
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
    console.log(this.user);
    if(this.user.id < 1){
      await this.saveUser(this.user);
    }else{
      await this.updateUser(this.user);
    }
  }


  async saveUser(user: any) {
    var id =  localStorage.getItem('email');
    console.log(id);
    user.createdByEmailId = id;
    await lastValueFrom(this.userService.saveUser(user)).then(
      response => {
      if (response.status === HttpStatusCode.Created) {
        this.toastr.success('User added successfully.')
        this.getUsersList();
      }
    }, error => {
      if (error.status === HttpStatusCode.Unauthorized) {
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



}
