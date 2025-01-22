import { Component, OnInit } from '@angular/core';
import { RegistrationService } from './service/Registration.service';
import { lastValueFrom, timer } from 'rxjs';
import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
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
export class RegistrationComponent implements OnInit {

  constructor(private registrationService: RegistrationService,
    private toastrService: ToastrService,
    private router: Router,
    private loginService: LoginService
  ){}
  ngOnInit(): void {
   this.startTimer();
  }
showEmailButton: boolean = false;
  showNumberButton: boolean = false;
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  user = {
    email:'',
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

  disclaimerChecked = false;
  legitimatePurposeChecked = false;
  // is = false;

  checkBoth() {
    this.isAuthorized = this.disclaimerChecked && this.legitimatePurposeChecked;
    this.validateCheckbox()
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
  
          //const myModal = new Modal(document.getElementById('exampleModalCenter'));
          //myModal.show();
          this.router.navigateByUrl('/reg-success');
        } else {
         
          this.toastrService.error('Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Error during registration:', error);
        this.toastrService.error('An error occurred during registration. Please try again.');
      }
    } else {
     
     // this.toastrService.error('Please fix the errors in the form.');
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
  timerDisplay: string = '01:00';
  timerActive: boolean = true;
  private countdown: any;
  private remainingTime: number = 60; 
  otpExpired: boolean = false;

  startTimer(): void {
    this.countdown = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.updateTimerDisplay(); 
      } else {
        this.timerActive = false; 
        this.otpExpired = true;  
        clearInterval(this.countdown);
        this.otp = null;
      }
    }, 1000);
  }
  updateTimerDisplay(): void {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    this.timerDisplay = `${this.pad(minutes)}:${this.pad(seconds)}`;
  }
  // Add leading zeros to time values
  pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
  registrationUserId: string = ''; // The email or user ID for OTP
  otpResentMessage: string = '';

  resendOtp(): void {
    if (!this.regUser.registrationUserId) {
      this.toastrService.error('Please provide a valid email or registration ID.');
      return;
    }
  
    // Call the resend OTP service
    this.registrationService.resendOtp(this.regUser.registrationUserId).subscribe({
      next: (response) => {
        // Check if OTP resend was successful
        if (response.isRegistrationSuccess) {
          this.toastrService.success('OTP has been resent successfully!');
          this.otpResentMessage = 'OTP resent successfully.';
          this.resetTimer();
          this.startTimer();
          
          
        } else {
          this.toastrService.error('Failed to resend OTP. User not found.');
        }
      },
      error: (err) => {
        console.log('Error resending OTP:', err);
        this.toastrService.error('Error occurred while resending OTP.');
      }
    });
  }
  
  loginUserOtp: number = 0;
  regUserId: string = '';
 
  loading: boolean = false;
  error: string | null = null;


  resetTimer(): void {
    this.remainingTime = 120;  // Reset to 60 seconds
    this.timerActive = true;
    this.otpExpired = false;  // Mark OTP as not expired
    this.timerDisplay = '02:00';  // Reset timer display
    if (this.countdown) {
      clearInterval(this.countdown);  // Clear any existing timer
    }
  }

  errorMessage: string = '';
  successMessage: string = '';
 

  verifyOtp() {
    console.log('Starting OTP verification...');
    
    // Step 1: Check if OTP has expired
    if (this.otpExpired) {
      this.toastrService.error('OTP has expired. Please request a new one.');
      return;
    }
  
    // Step 2: Check if email or OTP is missing
    if (!this.regUser.registrationUserId || !this.otp) {
      console.log('Error: Email or OTP is missing');
      this.toastrService.error('Please enter both email and OTP.');
      this.errorMessage = 'Please enter both email and OTP.';
      this.successMessage = '';
      return;
    }
  
    console.log('Verifying OTP for User ID:', this.regUser.registrationUserId);
    console.log('Entered OTP:', this.otp);
  
    // Step 3: Call backend to verify OTP
    this.registrationService.verifyOtp(this.regUser.registrationUserId, this.otp).subscribe({
      next: (response) => {
        console.log('OTP verification successful:', response);
        
        if (response) {
          // OTP verification success
          this.toastrService.success("OTP verification successful");
          this.successMessage = 'OTP verified successfully!';
          this.errorMessage = '';
          
          this.resetTimer();
          this.otpExpired = true; // OTP is expired after verification
  
          // Close the registration form/modal
          document.getElementById('closeRegForm')?.click();
  
          // Step 4: Set email verification status to true
          this.isEmailVerified = true;
        } else {
          // OTP verification failed
          this.toastrService.error('OTP has expired. Please request a new one.');
          this.successMessage = '';
          this.errorMessage = 'Invalid OTP. Please try again.';
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log('Error during OTP verification:', error);
        this.toastrService.error('Failed to verify OTP. Please try again.');
        this.successMessage = '';
        this.errorMessage = 'Error occurred while verifying OTP.';
      }
    });
  }
  

regUser = {
  id: 0,

  registrationUserId: '',
  registrationOtp:0,
  isRegistrationSuccess: false
}
isEmailVerified = false;
isReg : boolean = false;
async saveRegUser() {
  // Check if email (user.userId) is provided
  if (!this.user.userId || this.user.userId.trim() === "") {
    console.log('Error: Email is missing');
    this.toastrService.error('Please provide email ID.');  // Show error message to the user
    return; // Exit early if email is missing
  }

  // Proceed with the registration process if the email is provided
  this.regUser.registrationUserId = this.user.userId;

  try {
    const response = await lastValueFrom(this.registrationService.saveRegUser(this.regUser));

    // Handle the response from the registration service
    if (response.status === HttpStatusCode.Created) {
      this.isReg = response.body;
      if (!this.isReg) {
        console.log('exe1');
        this.toastrService.error('User already exists');
      } else {
        console.log('exe2');
        this.isEmailVerified = true;
        this.openModal();
      }
    }
  } catch (error) {
    console.log('Error during registration:', error);
    this.toastrService.error('An error occurred while registering the user.');
  }
}


openModal() {
  document.getElementById('showModal').click();
}

async getRegUser(){

}

}

