import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MainHeaderService } from '../main-header/service/main-header.service';
import { ToastrService } from 'ngx-toastr';

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
    organisationId: 0
  
  }
  value: boolean;
  constructor(private router:Router,private passwordService:MainHeaderService,private toastr: ToastrService){}
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;
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

  // Password validation function
  validatePassword(password: string): boolean {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  }
  successMessage: string | null = null;
  errorMessage: string | null = null;
oldPassword:string='';
  changePasswordButton(): void {
    console.log(this.user);
    console.log(this.oldPassword)
    if (this.user.userId || !this.user.newPassword || !this.user.confirmPassword || !this.oldPassword) {
      this.toastr.error('All fields are required.', 'Error');
      return;
    }


    // Validate password (custom validation for password strength)
    if (!this.validatePassword(this.user.newPassword)) {
      this.errorMessage = 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.';
      return;
    }

    // Check if new password and confirm password match
    if (this.user.newPassword !== this.user.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    // Call the backend to validate the old password first before updating
    this.checkOldPassword();
  }
  checkOldPassword() {
    if (!this.oldPassword) {
      this.toastr.error('Old password is required', 'Error');
      return;
    }

    // Call the backend service to validate the old password
    this.passwordService.validateOldPassword(this.oldPassword).subscribe({
      next: (response: any) => {
        if (response === 'Old password is valid.') {
          // Success: old password is valid
          this.successMessage = 'Old password is correct. You can now update your password.';
          this.toastr.success(this.successMessage, 'Success');
        } else {
          // Error: old password is incorrect
          this.errorMessage = 'Old password is incorrect.';
          this.toastr.error(this.errorMessage, 'Error');
        }
      },
      error: (error) => {
        // Handle error response
        console.error('Error occurred:', error);
        this.toastr.error('An error occurred while validating the old password. Please try again.', 'Error');
      }
    });
  }
}
