import { Component } from '@angular/core';
import { User } from '../model/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgotPasswordOtpValidationService } from '../forgot-password-otp-validation/service/forgot-password-otp-service.service';
import { ToastrService } from 'ngx-toastr';
import { RgtrForgotPasswordOtpValidationService } from './service/rgtr-forgot-password-otp-validation.service';

@Component({
  selector: 'app-rgtr-forgot-password-otp-validation',
  templateUrl: './rgtr-forgot-password-otp-validation.component.html',
  styleUrls: ['./rgtr-forgot-password-otp-validation.component.css']
})
export class RgtrForgotPasswordOtpValidationComponent {

  user: User = new User();
    otp: number;
    isOtpVerified: boolean = false;
  
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private otpValidationService: RgtrForgotPasswordOtpValidationService,
      private toastr: ToastrService
    ) {}
  
  
  
    
    ngOnInit(): void {
      // Retrieve email (userId) 
      this.route.queryParams.subscribe(params => {
        this.user.userId = params['email'];  
        console.log(this.user.userId);
      });
      this.resetTimer();
      this.startTimer();
    }
  
    verifyOtp() {
      if (!this.otp) {
        this.toastr.error('Please enter a valid OTP.');
      //  this.resendOtp();
        return;
      }
  
      this.otpValidationService.verifyOtp(this.user.userId, this.otp).subscribe(
        (isVerified) => {
          if (isVerified) {
            this.toastr.success('OTP verified successfully!');
            this.router.navigate(['/r-f-p-r'], { queryParams: { email: this.user.userId } });
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
          this.resetTimer();
          this.startTimer();
        },
        (error) => {
          console.error('Error resending OTP:', error);
          this.toastr.error('An error occurred while resending OTP.');
        }
      );
    }
    display: string;
    resetTimer() {
      this.pauseTimer();
      this.time =300;
      this.display = this.transform(this.time);
    }
    time: number = 300; // 120 seconds = 2 minutes
   
    interval;
    startTimer() {
      this.interval = setInterval(() => {
        if (this.time > 0) {
          this.time--;
          this.display = this.transform(this.time);
        } else {
          clearInterval(this.interval);
        }
      }, 1000);
      this.display = this.transform(this.time);
    }
  
    /**
     * Transform the seconds into a formatted time string (mm:ss)
     * @param value - Time in seconds
     * @returns Formatted time string (mm:ss)
     */
    transform(value: number): string {
      const minutes: number = Math.floor(value / 60);
      const seconds: number = value - minutes * 60;
      const formattedMinutes: string = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const formattedSeconds: string = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return formattedMinutes + ':' + formattedSeconds;
    }
  
    /**
     * Pause the timer
     */
    pauseTimer() {
      clearInterval(this.interval);
    }
}
