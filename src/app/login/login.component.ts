import { Component } from '@angular/core';
import { LoginService } from './service/login.service';
import { lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  //loggedInUserEmailId: string = localStorage.getItem('email');

  constructor(private loginService: LoginService,
    private toastr: ToastrService, private router: Router
  ){

  }

  showPassword: boolean | undefined;
  
  showOtpButton: boolean = false;
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
    await lastValueFrom(this.loginService.verifyOtpForLoginUserByUserId(this.user.email, this.otp)).then(
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
      await lastValueFrom(this.loginService.userLoginToDR(this.user)).then(
        response => {
          this.router.navigateByUrl('/home');
          this.toastr.success('Login Success')
        }
      )
    }else{
      this.toastr.error('Invalid OTP');
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleOtpButton() {
    this.showOtpButton = this.user.email.length > 0; 
  }

  onFocus() {

    if (!this.showOtpButton && this.user.email.length > 0) {
      this.showOtpButton = true;
    }
  }

  loginUserOtp: number = 0;
  async getOtpForLoginUser(){
    await lastValueFrom(this.loginService.getOtpForLoginUserByUserId(this.user.email)).then(
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

}
