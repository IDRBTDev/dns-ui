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
  isNewPasswordVisible:boolean=false;
  isConfirmPasswordVisible: boolean = false;
  passwordErrorMessage: string = '';
  passwordNameInput: boolean = true;
  // newpasswordChange() {
  //   const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*])[A-Za-z\d@!#$%^&*]{8,}/;
  //   if (!this.user.newPassword) {
  //     this.passwordNameInput = false;
  //     this.passwordErrorMessage = 'Password should not be empty';
  //   } else if (!pattern.test(this.user.newPassword)) {
  //     this.passwordNameInput = false;
  //     this.passwordErrorMessage = 'Password should not be empty';
  //   } else {
  //     this.passwordNameInput = true;
  //     this.passwordErrorMessage = '';
  //   }
  // }
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
 
  newpasswordChange() {
    // Remove spaces from the password input
    this.user.newPassword = this.user.newPassword.replace(/\s+/g, '');
  
    // Regex pattern for strong password
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*])[A-Za-z\d@!#$%^&*]{8,}/;
  
    // Check if the password is empty
    if (!this.user.newPassword) {
      this.passwordNameInput = false;
      this.passwordErrorMessage = 'Password should not be empty';
    }
    // Check for spaces in the password
    else if (/\s/.test(this.user.newPassword)) {
      this.passwordNameInput = false;
      this.passwordErrorMessage = 'Password cannot contain spaces';
    }
    // Check for password complexity (uppercase, lowercase, digit, special char)
    else if (!pattern.test(this.user.newPassword)) {
      this.passwordNameInput = false;
      this.passwordErrorMessage = 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character';
    } else {
      this.passwordNameInput = true;
      this.passwordErrorMessage = '';
    }
    // Check for matching password if both are entered
    this.checkPasswordsMatch();
  }
 
  
  confirmPasswordChange() {
    // Remove spaces from the confirm password input
    this.user.confirmPassword = this.user.confirmPassword.replace(/\s+/g, '');
  
    // Check if confirm password is empty
    if (!this.user.confirmPassword) {
      this.confirmPasswordInput = false;
      this.confirmPasswordErrorMessage = 'Confirm password should not be empty';
    } 
    // Check for spaces in the confirm password
    else if (/\s/.test(this.user.confirmPassword)) {
      this.confirmPasswordInput = false;
      this.confirmPasswordErrorMessage = 'Confirm password cannot contain spaces';
    } else {
      this.confirmPasswordInput = true;
      this.confirmPasswordErrorMessage = '';
    }
  
    // Check if the passwords match
    this.checkPasswordsMatch();
  }

  checkPasswordsMatch() {
    if (this.user.newPassword && this.user.confirmPassword && this.user.newPassword !== this.user.confirmPassword) {
      this.confirmPasswordInput = false;
      this.confirmPasswordErrorMessage = 'Passwords do not match';
    } else if (this.user.newPassword && this.user.confirmPassword && this.user.newPassword === this.user.confirmPassword) {
      this.confirmPasswordInput = true;
      this.confirmPasswordErrorMessage = '';
    }}

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    const passwordField = document.getElementById('oldPassword') as HTMLInputElement;
    passwordField.type = this.isPasswordVisible ? 'text' : 'password';
  }
  toggleNewPasswordVisibility() {
    this.isNewPasswordVisible = !this.isNewPasswordVisible;
    const passwordField = document.getElementById('newPassword') as HTMLInputElement;
    passwordField.type = this.isNewPasswordVisible ? 'text' : 'password';
  }
  toggleConfirmPasswordVisibility() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    const confirmPasswordField = document.getElementById('confirmPassword') as HTMLInputElement;
    confirmPasswordField.type = this.isConfirmPasswordVisible ? 'text' : 'password';
  }
   validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
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
   // this.checkOldPassword();
    this.updateNewPassword();
  }
 
    // Declare error message property
    oldPasswordErrorMessage: string = '';
    oldPasswordSuccessMessage: string = '';
    isOldPasswordCorrect:boolean=false;
  checkOldPassword() {
    const email = localStorage.getItem('email');
    console.log(email);
  
    // Clear previous messages
    this.oldPasswordErrorMessage = '';
    this.oldPasswordSuccessMessage = '';
  
    // Check if the old password is provided and if the email is available
    if (!email || !this.user.oldPassword) {
      console.error('User ID or Old Password is missing.');
      this.oldPasswordErrorMessage = 'Please provide the old password.';
      return;
    }
  
    // Check if the new password is the same as the old password
    if (this.user.oldPassword === this.user.newPassword) {
      this.oldPasswordErrorMessage = 'New password cannot be the same as the old password.';
      return;
    }
  
    // Call the service to validate the old password
    this.passwordService.validateOldPassword(email, this.user.oldPassword).subscribe({
      next: (isValid: string) => {
        if (isValid) {
          this.isOldPasswordCorrect = true;
          this.oldPasswordSuccessMessage = 'Old password is correct.';
          this.oldPasswordSuccessMessage=''
        } else {
          this.isOldPasswordCorrect = false;
          this.oldPasswordErrorMessage = 'Old password is incorrect.';
          this.oldPasswordSuccessMessage=''
        }
      },
      error: (error) => {
        console.error('Error occurred:', error);
        this.oldPasswordErrorMessage = 'Old password is incorrect.';
        this.oldPasswordSuccessMessage=''
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
    next: (isUpdated: string) => {
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
