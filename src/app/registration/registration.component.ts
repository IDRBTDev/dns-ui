import { Component } from '@angular/core';
import { RegistrationService } from './service/Registration.service';
import { lastValueFrom } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoginService } from '../login/service/login.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  otp: number ;

  constructor(private registrationService: RegistrationService,
    private toastrService: ToastrService,
    private router: Router,
    private loginService: LoginService
  ){}

 
  showEmailButton: boolean = false; 
showNumberButton:boolean=false;
phn:String='';
  toggleEmailButton() {
    
    this.showEmailButton = this.user.userId.length > 0;
  }

  onFocus() {
   
    if (!this.showEmailButton && this.user.userId.length > 0) {
      this.showEmailButton = true;
    }
  }
  toggleNumberButton() {
 
    this.showNumberButton = this.user.mobileNumber.length > 0; 
  }

  onFocus1() {
   
    if (!this.showNumberButton && this.user.mobileNumber.length > 0) {
      this.showNumberButton = true;
    }
  }

  user = {
    name:'',
    userId: '',
    encryptedPassword: '',
    mobileNumber: '',
    confirmPassword:''
  }

  async registerUser(){
    await lastValueFrom(this.registrationService.userRegistationToDR(this.user)).then(
      response => {
        if(response.status === HttpStatusCode.Created){
          this.toastrService.success('User registration successfull');
          this.router.navigateByUrl('/login')
        }
      }
    )
  }

  async generateOTPAndVerifyEmail(){
    await lastValueFrom(this.loginService.getOtpForLoginUserByUserId(this.user.userId)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          console.log(response.body);
        }
      }
    )
  }

}
