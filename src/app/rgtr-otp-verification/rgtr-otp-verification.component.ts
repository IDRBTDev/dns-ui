import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { LoginService } from '../login/service/login.service';

@Component({
  selector: 'app-rgtr-otp-verification',
  templateUrl: './rgtr-otp-verification.component.html',
  styleUrls: ['./rgtr-otp-verification.component.css']
})
export class RgtrOtpVerificationComponent implements OnInit {

   constructor(private loginService: LoginService,
        private toastr: ToastrService, private router: Router
      ){
       
      }
  ngOnInit(): void {
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
        if(this.otp === undefined || this.otp === null){
          this.otp = 0;
        }
        this.user=JSON.parse(localStorage.getItem('user'));
        console.log(this.user)
        await lastValueFrom(this.loginService.verifyRegistrarOtpForLoginUserByUserId(this.user.email, this.otp)).then(
          response => {
            if(response.status === HttpStatusCode.Ok){
              this.isOtpValid = response.body;
              this.otp = null;
            }
          }
        )
        console.log(this.isOtpValid)
        //login to app
        if(this.isOtpValid){
          await lastValueFrom(this.loginService.rgtruserLoginToDR(this.user)).then(
            response => {
              //console.log(response.body)
              localStorage.setItem('email', response.headers.get('email'));
              localStorage.setItem('userRole',response.headers.get('userRole'));
              localStorage.setItem('active',response.headers.get('active'));
              localStorage.setItem('organisationId', response.headers.get('organisationId'));
              let email = localStorage.getItem('email');
              let role = localStorage.getItem('userRole');
              let active = localStorage.getItem('active');
              let organisationId = localStorage.getItem('organisationId');
              console.log(email);
              console.log(role);
              console.log(organisationId)
              if(active === 'false'){
                this.toastr.error('User Inactive');
                return;
              }
              if(role === 'IDRBTADMIN'){
                this.router.navigateByUrl('/rgtr-dashboard');
                this.toastr.success('Login Success');
               }else{
                this.router.navigateByUrl('/dsc-verification');
                this.toastr.success('Login Success');
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
        await lastValueFrom(this.loginService.getOtpForRgtrLoginUserByUserId(this.user.email)).then(
          response => {
            if(response.status === HttpStatusCode.Ok){
              this.loginUserOtp = response.body;
              console.log(this.loginUserOtp)
              this.toastr.success('An OTP has been sent to you email.')
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

      time: number = 120; // 120 seconds = 2 minutes
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
   * Reset the timer back to 2 minutes (02:00)
   */
  resetTimer() {
    this.pauseTimer();
    this.time = 120;
    this.display = this.transform(this.time);
  }
}
