import { Component } from '@angular/core';
import { User } from '../model/user.model';
import { ForgotPasswordService } from './service/forgot-password-email-verification-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password-email-verification',
  templateUrl: './forgot-password-email-verification.component.html',
  styleUrls: ['./forgot-password-email-verification.component.css']
})
export class ForgotPasswordEmailVerificationComponent {

  userId: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  user: User | null = null;

  constructor(private forgotPasswordService: ForgotPasswordService, private router: Router, // For navigation
    private toastr: ToastrService ) {}

  
   verifyUser() {
    this.errorMessage = ''; 
    this.successMessage = ''; 
    this.user = null; 

    if (this.userId) {
      this.forgotPasswordService.verifyEmail(this.userId).subscribe(
        (response: User) => {
          this.user = response; 
          this.toastr.success('Email verified successfully'); 
          this.router.navigate(['/forgot-password-otp-validation']);
        },
        (error) => {
          this.errorMessage = error.error; 
          this.toastr.error('User does not exist'); 
        }
      );
    } else {
      this.errorMessage = 'Please enter a valid userId.'; 
      this.toastr.warning('Please enter a valid userId'); 
    }
  }
}
