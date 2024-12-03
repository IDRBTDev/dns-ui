import { Component } from '@angular/core';
import { RegistrationService } from './service/Registration.service';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoginService } from '../login/service/login.service';
import * as $ from 'jquery';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  constructor(private registrationService: RegistrationService,
    private toastrService: ToastrService,
    private router: Router,
    private loginService: LoginService
  ){}

showEmailButton: boolean = false;
  showNumberButton: boolean = false;
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  user = {
    userName: '',
    userId: '',
    encryptedPassword: '',
    mobileNumber: '',
    confirmPassword: '',
    role:'',
    organisationId: 0
  
  }
otp:number;
  toggleEmailButton() {
    this.showEmailButton = this.user.userId.length > 0;
  }

  toggleNumberButton() {
    this.showNumberButton = this.user.mobileNumber.length > 0;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    const passwordField = document.getElementById('password') as HTMLInputElement;
    passwordField.type = this.isPasswordVisible ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    const confirmPasswordField = document.getElementById('confirmPassword') as HTMLInputElement;
    confirmPasswordField.type = this.isConfirmPasswordVisible ? 'text' : 'password';
  }


  

  async registerUser() {
   
    this.nameChange();
    this.emailChange();
    this.numberChange();
    this.passwordChange();
    this.confirmPasswordChange();
    this.validateCheckbox();
  
    if (this.formValid()) {
      try {
        const response = await lastValueFrom(this.registrationService.userRegistationToDR(this.user));
        
        if (response.status === HttpStatusCode.Created) {
          
          this.toastrService.success('User registration successful');
  
          const myModal = new Modal(document.getElementById('exampleModalCenter'));
          myModal.show();
        } else {
         
          this.toastrService.error('Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Error during registration:', error);
        this.toastrService.error('An error occurred during registration. Please try again.');
      }
    } else {
     
      this.toastrService.error('Please fix the errors in the form.');
    }
  }
  
  continueToLogin() {
  
    this.router.navigateByUrl('/login');
    //window.location.reload();
  }
  

  formValid() {
    console.log("validation checking");
    return this.nameInput && this.emailInput && this.numberInput && this.passwordNameInput && this.confirmPasswordInput && this.isAuthorized;
  }

  nameErrorMessage: string = '';
  nameInput: boolean = true;
  nameChange() {
    if (!this.user.userName) {
      this.nameInput = false;
      this.nameErrorMessage = 'Name should not be empty.';
    } else if (this.user.userName.length > 25) {
      this.nameInput = false;
      this.nameErrorMessage = 'Name should not exceed 25 characters.';
    } else {
      this.nameInput = true;
      this.nameErrorMessage = '';
    }
  }

  emailInput: boolean = true;
  emailerrorMessage: string = '';
  emailChange() {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
    if (!this.user.userId) {
      this.emailInput = false;
      this.emailerrorMessage = 'Email ID should not be empty';
    } else if (!emailPattern.test(this.user.userId)) {
      this.emailInput = false;
      this.emailerrorMessage = 'Please enter a valid email ID';
    } else {
      this.emailInput = true;
      this.emailerrorMessage = '';
    }
  }

  numberInput: boolean = true;
  numbererrorMessage: string = '';
  numberChange() {
    const numberPattern = /^\d{10}$/;
if (!this.user.mobileNumber) {
      this.numberInput = false;
      this.numbererrorMessage = 'Mobile number should not be empty';
    } else if (!numberPattern.test(this.user.mobileNumber)) {
      this.numberInput = false;
      this.numbererrorMessage = 'Please enter a valid mobile number starting with +91 and 10 digits';
    } else {
      this.numberInput = true;
      this.numbererrorMessage = ''; 
    }
  }

  passwordErrorMessage: string = '';
  passwordNameInput: boolean = true;
  passwordChange() {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*])[A-Za-z\d@!#$%^&*]{8,}/;
    if (!this.user.encryptedPassword) {
      this.passwordNameInput = false;
      this.passwordErrorMessage = 'Password should not be empty';
    } else if (!pattern.test(this.user.encryptedPassword)) {
      this.passwordNameInput = false;
      this.passwordErrorMessage = 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character';
    } else {
      this.passwordNameInput = true;
      this.passwordErrorMessage = '';
    }
  }

  confirmPasswordErrorMessage: string = '';
  confirmPasswordInput: boolean = true;
  confirmPasswordChange() {
    if (!this.user.confirmPassword) {
      this.confirmPasswordInput = false;
      this.confirmPasswordErrorMessage = 'Confirm password should not be empty';
    } else if (this.user.encryptedPassword !== this.user.confirmPassword) {
      this.confirmPasswordInput = false;
      this.confirmPasswordErrorMessage = 'Passwords do not match';
    } else {
      this.confirmPasswordInput = true;
      this.confirmPasswordErrorMessage = '';
    }
  }

  isAuthorized: boolean = false;
  showError: boolean = false;
  validateCheckbox() {
    if (!this.isAuthorized) {
      this.showError = true;
    } else {
      this.showError = false;
    }
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
  errorMessage: string = '';
  successMessage: string = '';

  verifyOtp() {
    console.log('Starting OTP verification...');
    
    if (!this.user.userId || !this.otp) {
        console.log('Error: UserId or OTP is missing');
        
        this.errorMessage = 'Please enter OTP.';
        this.successMessage = '';
        return;
    }
    console.log('Verifying OTP for User ID:', this.user.userId);
    console.log('Entered OTP:', this.otp);

    this.registrationService.verifyOtp(this.regUser).subscribe({
        next: (response) => {
            console.log('OTP verification successful:', response);
            this.toastrService.success("OTP verification successful")
            this.successMessage = 'OTP verified successfully!';
            this.errorMessage = '';
            document.getElementById('closeRegForm').click();
        },
        error: (error: HttpErrorResponse) => {
            console.log('Error during OTP verification:', error);
            
            this.errorMessage = 'Failed to verify OTP. Please try again.';
            this.successMessage = '';
        }
    });
}

regUser = {
  id: 0,
  registrationUserId: '',
  registrationOtp:0,
  isRegistrationSuccess: false
}

isReg : boolean = false;
async saveRegUser(){
  this.regUser.registrationUserId = this.user.userId;
  await lastValueFrom(this.registrationService.saveRegUser(this.regUser)).then(
    response => {
      if(response.status === HttpStatusCode.Created){
        this.isReg = response.body;
        if(!this.isReg){
          console.log('exe1')
          this.toastrService.error('User already exists')
        }else{
          console.log('exe2')
          this.openModal();
        }
      }
    }
  )
}

openModal() {
  document.getElementById('showModal').click();
}

async getRegUser(){

}

}

