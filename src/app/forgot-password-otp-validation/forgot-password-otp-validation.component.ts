import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgotPasswordOtpValidationService } from './service/forgot-password-otp-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password-otp-validation',
  templateUrl: './forgot-password-otp-validation.component.html',
  styleUrls: ['./forgot-password-otp-validation.component.css']
})
export class ForgotPasswordOtpValidationComponent implements OnInit{

  user: User = new User();
  otp: number;
  isOtpVerified: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private otpValidationService: ForgotPasswordOtpValidationService,
    private toastr: ToastrService
  ) {}



  
  ngOnInit(): void {
    // Retrieve email (userId) 
    this.route.queryParams.subscribe(params => {
      this.user.userId = params['email'];  
    });
  }

  verifyOtp() {
    if (!this.otp) {
      this.toastr.error('Please enter a valid OTP.');
      this.resendOtp();
      return;
    }

    this.otpValidationService.verifyOtp(this.user.userId, this.otp).subscribe(
      (isVerified) => {
        if (isVerified) {
          this.toastr.success('OTP verified successfully!');
          this.router.navigate(['/forgot-password-reset'], { queryParams: { email: this.user.userId } });
        } else {
          this.toastr.error('Invalid OTP. Please try again.');
        }
      },
      (error) => {
        console.error('OTP verification failed', error);
        this.toastr.error('An error occurred while verifying the OTP.');
      }
    );
  }

  resendOtp() {
    this.otpValidationService.resendOtp(this.user.userId).subscribe(
      (otp) => {
        console.log(otp);
        this.toastr.success('OTP resent successfully to your email ID.');
        this.otp = otp; 
      },
      (error) => {
        console.error('Error resending OTP:', error);
        this.toastr.error('An error occurred while resending OTP.');
      }
    );
  }
  display: string;


}
