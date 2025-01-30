import { Component } from '@angular/core';
import { User } from '../model/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgotPasswordResetService } from '../forgot-password-reset/service/forgot-password-reset-service.service';
import { ToastrService } from 'ngx-toastr';
import { RgtrForgotPasswordResetService } from './service/rgtr-forgot-password-reset.service';

@Component({
  selector: 'app-rgtr-forgot-password-reset',
  templateUrl: './rgtr-forgot-password-reset.component.html',
  styleUrls: ['./rgtr-forgot-password-reset.component.css']
})
export class RgtrForgotPasswordResetComponent {

  user: User = new User();
    newPassword: string;
    confirmPassword: string;
  
    constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private forgotPasswordResetService: RgtrForgotPasswordResetService,
      private toastr: ToastrService
    ) {}
  
    ngOnInit() {
      this.activatedRoute.queryParams.subscribe(params => {
        this.user.userId = params['email'];  
      });
    }
  
     resetPassword() {
      if (!this.newPassword || !this.confirmPassword) {
        this.toastr.error('Please enter both new password and confirm password.');
        return;
      }
  
      if (this.newPassword !== this.confirmPassword) {
        this.toastr.error('Passwords do not match.');
        return;
      }
  
      let isValid = true;
  
      if (!/[a-z]/.test(this.newPassword)) {
        this.toastr.error('Password must contain at least one lowercase letter.');
        isValid = false;
      }
  
      if (!/[A-Z]/.test(this.newPassword)) {
        this.toastr.error('Password must contain at least one uppercase letter.');
        isValid = false;
      }
  
      if (!/[0-9]/.test(this.newPassword)) {
        this.toastr.error('Password must contain at least one number.');
        isValid = false;
      }
  
      if (!/[@#$*&]/.test(this.newPassword)) {
        this.toastr.error('Password must contain at least one special character (@, #, $, *, &).');
        isValid = false;
      }
  
      if (/^\s|\s$/.test(this.newPassword)) {
        this.toastr.error('Password should not start or end with a space.');
        isValid = false;
      }
  
      if (this.newPassword.length < 8) {
        this.toastr.error('Password must be at least 8 characters long.');
        isValid = false;
      }
  
      if (!isValid) {
        return;
      }
  
      this.user.encryptedPassword = this.newPassword;
  
      this.forgotPasswordResetService.updatePassword(this.user).subscribe(
        (response) => {
          this.toastr.success('Password reset successfully.');
          this.router.navigate(['/r-f-p-s']);
        },
        (error) => {
          this.toastr.error('An error occurred while resetting the password.');
        }
      );
    }
    passwordErrorMessage: string = '';
    passwordNameInput: boolean = true;
    passwordChange() {
      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*])[A-Za-z\d@!#$%^&*]{8,}/;
      if (!this.newPassword) {
        this.passwordNameInput = false;
        this.passwordErrorMessage = 'Password should not be empty';
      } else if (!pattern.test(this.newPassword)) {
        this.passwordNameInput = false;
        this.passwordErrorMessage = 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character';
      } else {
        this.passwordNameInput = true;
        this.passwordErrorMessage = '';
      }
    }
  
    
}
