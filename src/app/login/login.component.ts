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
    this.getOtpForLoginUser();
    localStorage.setItem('rgntUser',JSON.stringify(this.user));
      console.log(this.user.email)
    this.router.navigateByUrl('/rgnt-o-V');
    
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
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
