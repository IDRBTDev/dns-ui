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
      if (!this.user.email || !this.isValidEmail(this.user.email)) {
        this.toastr.error('Please enter a valid email address.');
        return;
      }
    await this.checkUserExist(this.user.email);
    
   
    
  }
  async checkUserExist(email){
     this.loginService.verifyUserEmail(email).subscribe({
      next:(response) => {
        if(response){
          // this.validatePassword();
          this.verifyEmailAndPassword();
          
          
        }else{
          this.toastr.error("User does not exist");
        }
      },
      error:(error) => {
        console.error('Verification failed', error);
        if (error.status === 404) {
          this.toastr.error('User not found.');
        } else {
          this.toastr.error('An error occurred while verifying the email.');
        }
      }
     });
      
  }
  async verifyEmailAndPassword(){
    await lastValueFrom(this.loginService.userLoginToDR(this.user)).then(
      response => {
        this.getOtpForLoginUser();
       
       
      },error => {
        if(error.status === HttpStatusCode.Unauthorized){
          console.log('sdsd')
          this.toastr.error('Invalid Credentials');
        }
      }
    )
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  emailValidation(){
    if(this.user.email!=''||this.user.email!=null){
      this.emailError=''
    }
  }
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
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
          this.toastr.success('An OTP has been sent to you email.');
          localStorage.setItem('rgntUser',JSON.stringify(this.user));
          console.log(this.user.email)
          localStorage.setItem('previousUrl','/login');
        this.router.navigateByUrl('/rgnt-o-V');
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
