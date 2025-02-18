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
  sanitizeInput(input: string): string {
    console.log("sanitized value",input.replace(/<script.*?>.*?<\/script>/gi, "").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
    return input.replace(/<script.*?>.*?<\/script>/gi, "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  
  isOtpValid: boolean = false;
  async login(){
    //check if OTP is valid
    this.user.email=this.sanitizeInput(this.user.email);
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
        this.emailError='Please enter a valid email address.'
        return;
      }
      // console.log(this.sanitizeInput(this.user.email.trim()));
    await this.checkUserExist(this.user.email.trim());
    
   
    
  }
  async checkUserExist(email){
     this.loginService.verifyUserEmail(email).subscribe({
      next:(response) => {
        if(response){
          console.log(response)
          // this.validatePassword();
          this.verifyEmailAndPassword();
          
          
        }else{
          this.toastr.error("User does not exist");
        }
      },
      error:(error) => {
        console.error('Verification failed', error);
        if (error.status === 404) {
          this.toastr.error('Invalid Credentials');
        } else {
          this.toastr.error('An error occurred while verifying the email.');
        }
      }
     });
      
  }
  // async verifyEmailAndPassword(){
  //   await lastValueFrom(this.loginService.userLoginToDR(this.user)).then(
  //     response => {
  //       this.getOtpForLoginUser();
       
       
  //     },error => {
  //       if(error.status === HttpStatusCode.Unauthorized){
  //         console.log('sdsd')
  //         this.toastr.error('Invalid Credentials');
  //       }
  //     }
  //   )
  // }
  async verifyEmailAndPassword() {
    const MAX_LOGIN_ATTEMPTS = 3; 
  
    try {
    this.user.password=this.sanitizeInput(this.user.password);
      const response = await lastValueFrom(this.loginService.userLoginToDR(this.user));
  
      this.getOtpForLoginUser();
    } catch (error) {
      
      console.log('Error response:', error);
  
      if (error.status === HttpStatusCode.Unauthorized) {
        console.log('Invalid credentials provided!');
        
        const remainingAttempts = error.headers.get('loginAttempts');
        console.log('Remaining Attempts:', remainingAttempts); 
  
       
        if (remainingAttempts !== null) {
          const attemptsLeft = parseInt(remainingAttempts, 10);
  
          if (attemptsLeft <= 0) {
            this.toastr.error('Your account is locked due to multiple failed login attempts');
          } else {
            
            this.toastr.error(`Invalid credentials. You have ${attemptsLeft} attempt(s) left.`, 'Login Failed');
          }
        } else {
        
          this.toastr.error('Your account is locked due to multiple  login attempts');
        }
      } else if (error.status === HttpStatusCode.Forbidden) {
     
        this.toastr.error('Your account is locked due to multiple failed login attempts');
      } else {
        this.toastr.error('An unexpected error occurred. Please try again later.', 'Error');
      }
    }
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

    email=this.sanitizeInput(email.trim());
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
  passWordValidation(){
    if(this.user.password!=''||this.user.password!=null){
      this.passwordError=''
    }
  }

  
  loginUserOtp: number = 0;
  async getOtpForLoginUser(){
    
    await lastValueFrom(this.loginService.getOtpForLoginUserByUserId(this.sanitizeInput(this.user.email))).then(
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
  isPasswordVisible =false;

  togglePasswordVisibility(){
    this.isPasswordVisible=!this.isPasswordVisible;
  }

}
