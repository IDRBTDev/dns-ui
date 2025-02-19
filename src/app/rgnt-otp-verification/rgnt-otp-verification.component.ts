import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { LoginService } from '../login/service/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rgnt-otp-verification',
  templateUrl: './rgnt-otp-verification.component.html',
  styleUrls: ['./rgnt-otp-verification.component.css']
})
export class RgntOtpVerificationComponent implements OnInit {

  constructor(private loginService: LoginService,
          private toastr: ToastrService, private router: Router
        ){
         
        }
  ngOnInit(): void {
    localStorage.removeItem('previousUrl');
    this.resetTimer();
          this.startTimer();
  }
      
        showPassword: boolean | undefined;
        
        
        otp: number ;
      
        user = {
          email: '',
          password: '',
          loginCity:'',
          loginState:'',
          loginCountry: ''
        }
      
        isOtpValid: boolean = false;
        async login(){
          //check if OTP is valid
          // if(this.otp === undefined || this.otp === null){
          //   this.otp = 0;
          // }
          if(this.otp?.toString().length==0 || this.otp ==undefined){
            this.toastr.error('please enter otp')
            return;
          }
          if(this.otp)
          this.user=JSON.parse(localStorage.getItem('rgntUser'));
          console.log(this.user,this.otp)

          let otpExpired=false;
          await lastValueFrom(this.loginService.verifyOtpForLoginUserByUserId(this.user.email, this.otp)).then(
            response => {
              console.log(response);
          
              if (response.status === HttpStatusCode.Ok) {
                this.isOtpValid = response.body;
                this.otp = null;
                // Handle successful login (navigate to dashboard, etc.)
                console.log("Login successful! Navigating to dashboard...");
                // (Your code for successful login navigation)
              } else if (response.status === HttpStatusCode.Unauthorized) {
                this.toastr.error("OTP expired. Please resend the OTP");
                // Optionally, provide a way for the user to resend the OTP
                console.log("OTP expired. Offering option to resend OTP...");
                // (Your code for offering OTP resend functionality)
              } else {
                // Handle unexpected errors (log, display generic error message)
                console.error("Unexpected error during OTP verification:", response);
                this.toastr.error("An error occurred during login. Please try again.");
              }
            }
          ).catch(error => {
            // Handle potential errors during the asynchronous operation
            if (error.status === HttpStatusCode.Unauthorized) {
              this.toastr.error("OTP expired. Please resend the OTP");
              otpExpired=true
              return;
              // Optionally, provide a way for the user to resend the OTP
            
              // (Your code for offering OTP resend functionality)
            } else{
              this.toastr.error("An error occurred during login. Please try again.");
            }
            
          });
          console.log(this.isOtpValid)
          //login to app
          if(otpExpired){
            return
          }
          if(this.isOtpValid){
            await lastValueFrom(this.loginService.userLoginToDR(this.user)).then(
              response => {
                console.log(response.headers)
                localStorage.setItem('initialLoginStatus',response.headers.get('initialLoginStatus'));
                localStorage.setItem('email', response.headers.get('email'));
                localStorage.setItem('userRole',response.headers.get('userRole'));
                localStorage.setItem('active',response.headers.get('active'));
                localStorage.setItem('jwtToken',response.headers.get('token'));
                localStorage.setItem('organisationId', response.headers.get('organisationId'));
                let LoginStatus=localStorage.getItem('initialLoginStatus');
                let email = localStorage.getItem('email');
                let role = localStorage.getItem('userRole');
                let active = localStorage.getItem('active');
                let organisationId = localStorage.getItem('organisationId');
                console.log(email);
                console.log(email);
                console.log(role);
                console.log(organisationId)
                console.log(LoginStatus);
                if(active === 'false'){
                  this.toastr.error('User Inactive');
                  return;
                }
                if(LoginStatus=='true'){
                  if(role === 'IDRBTADMIN'){
                    this.router.navigateByUrl('/rgtr-dashboard');
                    this.toastr.success('Logged in Successfully');
                   }else{
                    this.router.navigateByUrl('/dsc-verification');
                    localStorage.setItem('pageType','user');
                    this.toastr.success('Logged in Successfully');
                  }
                }else{
                  localStorage.setItem('tempTok',response.headers.get('token'));
                  localStorage.removeItem('jwtToken');
                  this.router.navigateByUrl('change-password');
                }
                
              },error => {
                if(error.status === HttpStatusCode.Unauthorized){
                  console.log('sdsd')
                  this.toastr.error('Incorrect EmailId or password');
                }
              }
            )
          }
          else{
            this.toastr.error('Invalid OTP');
          }
        }
      
        toggleShowPassword() {
          this.showPassword = !this.showPassword;
        }
      
      
        
        loginUserOtp: number = 0;
        async getOtpForLoginUser(){
          this.user=JSON.parse(localStorage.getItem('rgntUser'));
          await lastValueFrom(this.loginService.getOtpForLoginUserByUserId(this.user.email)).then(
            response => {
              if(response.status === HttpStatusCode.Ok){
                this.loginUserOtp = response.body;
                console.log(this.loginUserOtp)
                this.toastr.success('An OTP has been sent to you email.')
                this.resetTimer();
                this.startTimer();
              }
            },error => {
              if(error.status === HttpStatusCode.InternalServerError){
                this.toastr.error('Error while fetching otp... please try again.')
              }
            }
          )
        }
      
        async verifyOtpOfLoggedInUser(){
          await lastValueFrom(this.loginService.verifyOtpForLoginUserByUserId(this.user.email, this.otp)).then(
            response => {
              if(response.status === HttpStatusCode.Ok){
                console.log(this.otp)
              }
            }
          )
        }
        

  /**
   * Start the countdown timer
   */
  time: number = 300; // 120 seconds = 2 minutes
  display: string;
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

  /**
   * Reset the timer back to 2 minutes (05:00)
   */
  resetTimer() {
    this.pauseTimer();
    this.time = 300;
    this.display = this.transform(this.time);
  }

  otpValidation(event:KeyboardEvent){
    const invalidChars =['+','-','.','e'];
    const inputElement= event.target as HTMLInputElement;
    if(invalidChars.includes(event.key)|| (inputElement.value.length==6 && event.key!='Backspace')||event.keyCode===40||event.keyCode===38)
    {
      
        event.preventDefault();
    }
  }
 
 
}
