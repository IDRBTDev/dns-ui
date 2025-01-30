import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { RgtrLoginService } from './service/rgtr-login.service';

@Component({
  selector: 'app-rgtr-login',
  templateUrl: './rgtr-login.component.html',
  styleUrls: ['./rgtr-login.component.css']
})
export class RgtrLoginComponent {

   constructor(private rgtrLoginService :RgtrLoginService,
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
    passwordError:string='';
    emailError:string='';
    isOtpValid: boolean = false;
    async login(){
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
      this.rgtrLoginService.verifyUserEmail(email).subscribe({
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
    await lastValueFrom(this.rgtrLoginService.rgtruserLoginToDR(this.user)).then(
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
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
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
  
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    }
  
  
    
    loginUserOtp: number = 0;
    navigate:boolean=false;
    async getOtpForLoginUser(){
      await lastValueFrom(this.rgtrLoginService.getOtpForRgtrLoginUserByUserId(this.user.email)).then(
        response => {
          if(response.status === HttpStatusCode.Ok){
            this.loginUserOtp = response.body;
            console.log(this.loginUserOtp)
            this.toastr.success('An OTP has been sent to you email.')
            setTimeout(() => {
              this.navigate=true;
            }, 100);
            
            localStorage.setItem('rgtrUser',JSON.stringify(this.user));
              console.log(this.user.email)
              localStorage.setItem('previousUrl','/rgtr-login');
              this.router.navigate(['/rgtr-o-V']);
          }
        },error => {
          if(error.status === HttpStatusCode.InternalServerError){
            this.toastr.error('Error while fetching otp... please try again.')
          }
        }
      )
    }
  
    async verifyOtpOfLoggedInUser(){
      await lastValueFrom(this.rgtrLoginService.verifyRegistrarOtpForLoginUserByUserId(this.user.email, this.otp)).then(
        response => {
          if(response.status === HttpStatusCode.Ok){
            console.log(this.otp)
          }
        }
      )
    }
}
