import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MainHeaderService } from '../main-header/service/main-header.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  user = {
    userName: '',
    userId: '',
    encryptedPassword: '',
    mobileNumber: '',
    confirmPassword: '',
    newPassword:'',
    role:'',
    organisationId: 0,
    oldPassword:''
  
  }
  value: boolean;
  constructor(private router:Router,
    private passwordService:MainHeaderService,
    private toastr: ToastrService,
  private location: Location){}
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;
  passwordErrorMessage: string = '';
  passwordNameInput: boolean = true;
  passwordChange() {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*])[A-Za-z\d@!#$%^&*]{8,}/;
    if (!this.user.newPassword) {
      this.passwordNameInput = false;
      this.passwordErrorMessage = 'Password should not be empty';
    } else if (!pattern.test(this.user.newPassword)) {
      this.passwordNameInput = false;
      this.passwordErrorMessage = 'Password should not be empty';
    } else {
      this.passwordNameInput = true;
      this.passwordErrorMessage = '';
    }
  }
  CurrentpasswordErrorMessage: string = '';
  CurrentpasswordNameInput: boolean = true;
  CurrentpasswordChange() {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*])[A-Za-z\d@!#$%^&*]{8,}/;
    if (!this.user.oldPassword) {
      this.CurrentpasswordNameInput = false;
      this.CurrentpasswordErrorMessage = 'Password should not be empty';
    } else if (!pattern.test(this.user.oldPassword)) {
      this.CurrentpasswordNameInput = false;
      this.CurrentpasswordErrorMessage = 'Password should not be empty';
    } else {
      this.CurrentpasswordNameInput = true;
      this.CurrentpasswordErrorMessage = '';
    }
  }

  confirmPasswordErrorMessage: string = '';
  confirmPasswordInput: boolean = true;
  confirmPasswordChange() {
    if (!this.user.confirmPassword) {
      this.confirmPasswordInput = false;
      this.confirmPasswordErrorMessage = 'Confirm password should not be empty';
    } else if (this.user.newPassword !== this.user.confirmPassword) {
      this.confirmPasswordInput = false;
      this.confirmPasswordErrorMessage = 'Passwords do not match';
    } else {
      this.confirmPasswordInput = true;
      this.confirmPasswordErrorMessage = '';
    }
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
   validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  validatePassword(password: string): boolean {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  }
  successMessage: string | null = null;
  errorMessage: string | null = null;

email:string='';
  changePasswordButton(): void {
    console.log(this.user);
    console.log(this.user.oldPassword)
    if (this.email || !this.user.newPassword || !this.user.confirmPassword || !this.user.oldPassword) {
      this.toastr.error('All fields are required.', 'Error');
      return;
    }
    if (!this.validatePassword(this.user.newPassword)) {
      this.errorMessage = 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.';
      return;
    }

    if (this.user.newPassword !== this.user.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    this.checkOldPassword();
    this.updateNewPassword();
  }
  checkOldPassword() {
    const email = localStorage.getItem('email');
    console.log(email);

    if (!email || !this.user.oldPassword) {
      console.error('User ID or Old Password is missing.');
      this.toastr.error('Please provide both email and old password.', 'Error');
      return;
    }
    if (this.user.oldPassword === this.user.newPassword) {
      this.toastr.error('New password cannot be the same as the old password.', 'Error');
      return;
    }
    
    this.passwordService.validateOldPassword(email, this.user.oldPassword).subscribe({
      next: (isValid: boolean) => {
        if (isValid) {
         
        } else {
          this.toastr.warning('Old password is incorrect.', 'Error');
        }
      },
      error: (error) => {
        
        console.error('Error occurred:', error);
        this.toastr.error('An error occurred while validating the old password. Please try again.', 'Error');
      }
    });
  }


cancelButton(){
document.getElementById('clear').click();


}

forgetPasswordPage(){
  this.router.navigateByUrl('forgot-password-reset');
}

updateNewPassword(): void {
  const email = localStorage.getItem('email');
  if ( !email || !this.user.newPassword || !this.user.confirmPassword) {
    this.toastr.error('New password and confirmation are required.', 'Error');
    return;
  }

  this.passwordService.resetPassword(email, this.user.newPassword, this.user.confirmPassword).subscribe({
    next: (isUpdated: boolean) => {
      if (isUpdated) {
        this.toastr.success('Password updated successfully.', 'Success');
       
      } else {
        this.toastr.error('Failed to update password. Please try again.', 'Error');
      }
    },
    error: (error) => {
      console.error('Error occurred:', error);
      this.toastr.error('An error occurred while resetting your password. Please try again.', 'Error');
    }
  });
}

// conformButton(){
//   setTimeout(() => {
//     this.router.navigateByUrl('mainHeader');
//   }, 100);
  
// }


goBack(){
  console.log('executed')
  this.location.back();
}

}
