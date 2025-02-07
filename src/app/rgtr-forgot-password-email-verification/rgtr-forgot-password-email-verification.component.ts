import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RgtrForgotPasswordEmailVerificationService } from './service/rgtr-forgot-password-email-verification.service';

@Component({
  selector: 'app-rgtr-forgot-password-email-verification',
  templateUrl: './rgtr-forgot-password-email-verification.component.html',
  styleUrls: ['./rgtr-forgot-password-email-verification.component.css']
})

export class RgtrForgotPasswordEmailVerificationComponent {
 user: User = new User();
  otp: number | null = null;
  isOtpSent: boolean = false;
display:string;

  constructor(private forgotPasswordEmailVerificationService: RgtrForgotPasswordEmailVerificationService, private router: Router,
    private toastr: ToastrService, private route: ActivatedRoute,) {}


  

  verifyEmail() {
    if (!this.user.userId || !this.isValidEmail(this.user.userId)) {
      this.toastr.error('Please enter a valid email address.');
      return;
    }
  
    this.forgotPasswordEmailVerificationService.verifyUserEmail(this.user.userId).subscribe(
      (response) => {
        if (response) {
          this.sendOtp();
        } else {
          this.toastr.error('User not found.');
        }
      },
      (error) => {
        console.error('Verification failed', error);
        if (error.status === 404) {
          this.toastr.error('User not found.');
        } else {
          this.toastr.error('An error occurred while verifying the email.');
        }
      }
    );
  }

  sendOtp() {
    this.forgotPasswordEmailVerificationService.getOtpForUser(this.user.userId).subscribe(
      (otp) => {
        this.otp = otp;
        this.isOtpSent = true;
        console.log(otp);
        this.toastr.success('OTP sent successfully to your email ID.');
        this.router.navigate(['/r-f-p-o-v'], {
          queryParams: { email: this.user.userId, otp: this.otp }
        });
      },
      (error) => {
        this.toastr.error('An error occurred while sending OTP.');
      }
    );
  }


  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
   backButton(){
    this.router.navigateByUrl('/rgtr-login');
   }
}
