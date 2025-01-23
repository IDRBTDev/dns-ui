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
  emailError: string='';
  passwordError: string='';

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
    if(this.user.email==''||this.user.password==''){
      if(this.user.email==''){
        this.emailError="error"
      }
      if(this.user.password==''){
        this.passwordError="error"
      }
      return
    }
    this.getOtpForLoginUser();
    localStorage.setItem('rgntUser',JSON.stringify(this.user));
      console.log(this.user.email)
      localStorage.setItem('previousUrl','/login');
    this.router.navigateByUrl('/rgnt-o-V');
    
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  emailValidation(){
    if(this.user.email!=''||this.user.email!=null){
      this.emailError=''
    }
  }
  passWordValidation(){
    if(this.user.password!=''||this.user.password!=null){
      this.passwordError=''
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
