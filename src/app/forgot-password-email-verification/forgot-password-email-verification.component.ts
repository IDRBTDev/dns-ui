import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ForgotPasswordEmailVerificationService } from './service/forgot-password-email-verification-service.service';

@Component({
  selector: 'app-forgot-password-email-verification',
  templateUrl: './forgot-password-email-verification.component.html',
  styleUrls: ['./forgot-password-email-verification.component.css']
})
export class ForgotPasswordEmailVerificationComponent implements OnInit{

  user: User = new User();
  otp: number | null = null;
  isOtpSent: boolean = false;
display:string;

  constructor(private forgotPasswordEmailVerificationService: ForgotPasswordEmailVerificationService, private router: Router,
    private toastr: ToastrService, private route: ActivatedRoute,) {}


   ngOnInit(): void {}

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
        this.router.navigate(['/f-p-o-v'], {
          queryParams: { email: this.user.userId, otp: this.otp }
        });
      },
      (error) => {
        this.toastr.error('An error occurred while sending OTP.');
      }
    );
  }


  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
  backButton(){
    this.router.navigateByUrl('/login');
  }
   
}
