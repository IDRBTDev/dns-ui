import { Component, OnInit } from '@angular/core';
import { RegistrationService } from './service/Registration.service';
import { lastValueFrom, timer } from 'rxjs';
import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoginService } from '../login/service/login.service';
import * as $ from 'jquery';
import { Modal } from 'bootstrap';
import { RolesService } from '../roles/services/roles.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private registrationService: RegistrationService,
    private toastrService: ToastrService,
    private router: Router,
    private loginService: LoginService,
    private roleService:RolesService
  ){}
  ngOnInit(): void {
   this.getAllRoles();
  //  this.startTimer();
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
    userRoles:[],
    organisationId: 0
  }

  getAllRoles(){
    this.roleService.getAllRoles().subscribe({
      next:(response)=>{
        console.log(response.body)
        let AllRoles=response.body;
        this.user.userRoles[0] = AllRoles.find(role => {
          return role.roleName === "Super Admin";
      });
      this.startTimer();
      },error:(error)=>{
        console.log(error);
      }
    })
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
   namePattern = /^[A-Za-z\s]+$/;
  nameChange() {
   
    if (!this.user.userName) {
      this.nameInput = false;
      this.nameErrorMessage = 'Name should not be empty.';
    } else if (this.user.userName.length > 50) {
      this.nameInput = false;
      this.nameErrorMessage = 'Name should not exceed 50 characters.';
    } else if (!this.namePattern.test(this.user.userName)) {
      this.nameInput = false;
      this.nameErrorMessage = 'Name should only contain alphabets and spaces.';
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
  addCountryCode() {
        if (!this.user.mobileNumber || this.user.mobileNumber === '') {
          this.user.mobileNumber = ''; // Just clear the input
        }
      }
      countryCode: string = '+91';

    numberChange() {
        const numberPattern = /^[0-9]{10}$/; // Correct regex
        if (!this.user.mobileNumber) {
            this.numberInput = false;
            this.numbererrorMessage = 'Mobile number should not be empty';
        } else if (!numberPattern.test(this.user.mobileNumber)) {
            this.numberInput = false;
            this.numbererrorMessage = 'Please enter a valid 10-digit mobile number'; // Corrected message
        } else {
            this.numberInput = true;
            this.numbererrorMessage = '';
        }
        this.saveData();
    }
    fullMobileNumber: string | null = null;
    saveData() {
      if (this.fullMobileNumber) {
        // Your save logic here (using this.fullMobileNumber)
        console.log("Saving:", this.fullMobileNumber); // Placeholder
  
        // ... your API call or other save logic
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
  timerDisplay: string = environment.otpExpiryTimeDisplay;
  timerActive: boolean = true;
  private countdown: any;
  private remainingTime: number = environment.otpExpiryTime; 
  otpExpired: boolean = false;
  initialTime = environment.otpExpiryTime;
  startTimer(): void {
    const startTime = Date.now(); 
    const animationFrame = () => {
        const elapsedTime = Date.now() - startTime;
        this.remainingTime = Math.max(this.initialTime - Math.floor(elapsedTime / 1000), 0); 
        this.updateTimerDisplay();

        if (this.remainingTime > 0) {
            requestAnimationFrame(animationFrame); 
        } else {
            this.timerActive = false;
            this.errorMessage="OTP has expired. Please request a new OTP."
            // this.otpExpired = true;
            // this.otp = null; 
        }
    };
    requestAnimationFrame(animationFrame);
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
    if (!this.user.userId) {
      this.toastrService.error('Please provide a valid email or registration ID.');
      return;
    }
  
    // Call the resend OTP service
    this.registrationService.resendOtp(this.user.userId).subscribe({
      next: (response) => {
        // Check if OTP resend was successful
        if (response.isRegistrationSuccess) {
          this.toastrService.success('OTP has been resent successfully!');
          this.otpResentMessage = 'OTP resent successfully.';
          this.resetTimer();
          setTimeout(() => {
            this.startTimer();
          }, 0);
         
          
          
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
    this.remainingTime = 300;  // Reset to 60 seconds
    this.timerActive = true;
    this.otpExpired = false;  // Mark OTP as not expired
    this.timerDisplay = '05:00';
    this.errorMessage=''  // Reset timer display
    if (this.countdown) {
      clearInterval(this.countdown);  // Clear any existing timer
    }
  }

  errorMessage: string = '';
  successMessage: string = '';
  isRegistrationSuccess: boolean = false;
 
  verifyOtp() {
    console.log('Starting OTP verification...');
    
    // Step 1: Check if OTP has expired
    if (this.otpExpired) {
      this.toastrService.error('OTP has expired. Please request a new one.');
      return;
    }
  
    // Step 2: Check if email or OTP is missing
    if ( !this.otp) {
      console.log('Error: Email or OTP is missing');
      this.toastrService.error('Please enter both email and OTP.');
      this.errorMessage = 'Please enter both email and OTP.';
      this.successMessage = '';
      return;
    }
  
    console.log('Verifying OTP for User ID:', this.user.userId);
    console.log('Entered OTP:', this.otp);
  
    // Step 3: Call backend to verify OTP
    this.registrationService.verifyOtp(this.user.userId, this.otp).subscribe({
      next: (response) => {
        console.log('OTP verification response:', response);
  
        // Check if the response is valid
        if (response === true) {  // Backend returns true if OTP matches
          console.log('OTP verification successful');
          this.toastrService.success("OTP verification successful");
          this.successMessage = 'OTP verified successfully!';
          this.errorMessage = '';
          
          this.resetTimer();
          // this.startTimer();
          this.otpExpired = true; // OTP is expired after verification
  
          // Close the registration form/modal
          document.getElementById('closeRegForm')?.click();
          this.isRegistrationSuccess = true;
          // Set email verification status to true
          this.isEmailVerified = true;
        } else {
          // OTP verification failed
          console.log('Invalid OTP, response:', response);
          this.toastrService.error('Invalid OTP. Please try again.');
          this.successMessage = '';
          this.errorMessage = 'Invalid OTP. Please enter the correct OTP.';
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log('Error during OTP verification:', error);
  
        if (error.status === 401) {
          console.log("otp expired")
          // If the OTP is expired
          this.toastrService.error('OTP has expired. Please request a new one.');
          this.successMessage = '';
          this.errorMessage = 'OTP has expired. Please request a new OTP.';
          if (this.errorMessage.includes('OTP expired')) {
            this.otpExpired = true; // Mark OTP as expired
          }
        } else {
          // Other errors
          this.toastrService.error('Failed to verify OTP. Please try again.');
          this.successMessage = '';
          this.errorMessage = 'Error occurred while verifying OTP.';
        }
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
//   async saveRegUser() {
  
//   // Check if email (user.userId) is provided
//   if (!this.user.userId || this.user.userId.trim() === "") {
//     console.log('Error: Email is missing');
//     this.toastrService.error('Please provide email ID.');  // Show error message to the user
//     return; // Exit early if email is missing
//   }

//   // Proceed with the registration process if the email is provided
//   this.regUser.registrationUserId = this.user.userId;

//   try {
//     const response = await lastValueFrom(this.registrationService.saveRegUser(this.regUser));

//     // Handle the response from the registration service
//     if (response.status === HttpStatusCode.Created) {
//       this.isReg = response.body;
//       if (!this.isReg) {
//         console.log('exe1');
//         this.toastrService.error('User already exists');
//       } else {
//         console.log('exe2');
//         this.isEmailVerified = true;
//         this.openModal();
//       }
//     }
//   } catch (error) {
//     console.log('Error during registration:', error);
//     this.toastrService.error('An error occurred while registering the user.');
//   }
// }
 async saveRegUser() {
  try {
    // Step 1: Check if email (user.userId) is provided
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
    if (!this.user.userId || this.user.userId.trim() === "") {
      console.log('Error: Email is missing');
      this.toastrService.error('Please provide email ID.');  // Show error message to the user
      return; // Exit early if email is missing
    }
    else if(!emailPattern.test(this.user.userId)){
      this.toastrService.error('Please provide valid email ID.'); 
      return;
    }

    console.log('Checking if user exists with email:', this.user.userId);

    // Step 2: Check if the user already exists before proceeding with registration
    const userExists = await this.registrationService.checkUserExists(this.user.userId).toPromise();
    
    if (userExists) {  // User already exists
      this.toastrService.error('User already exists.');
      return; // Exit if the user already exists
    }

    /*
      if its there - return "User Already Exists" - STOP
	  	else
			i need to check in the User Registration table
			if there update otp and send email
			if not there insert user record and send otp

    */

    let regUserExists = await this.registrationService.checkRgntUserExistsDuringRegistration(this.user.userId).toPromise();

    console.log(regUserExists)
    this.openModal(); 
    
    // if (regUserExists?.isRegistrationSuccess==true) {  // User already registered in the registration table
    //   //Update the OTP??

    //   // If the user exists, directly mark the user as verified
    //   console.log('User already registered, marked as verified.');
    // // this.isRegistrationSuccess=true;
    //   this.isEmailVerified = true;
      
    //   this.toastrService.success('User already verified.');
    //   return; // Exit as the user is already verified
    // }else if(regUserExists==null){
    //   this.regUser.registrationUserId = this.user.userId;

    //   const response = await lastValueFrom(this.registrationService.saveRegUser(this.regUser));

    //   // Step 4: Handle the response from the registration service
    //   if (response.status === HttpStatusCode.Created) {
    //     this.isReg = response.body;
    //     if (!this.isReg) {
    //       console.log('exe1: Registration failed');
    //       this.toastrService.error('Failed to register user.');
    //     } else {
    //       console.log('exe2: User registered successfully');
    //     // this.isEmailVerified = true;
    //       this.openModal(); // Open the OTP verification modal
    //     }
    //   } else {
    //     this.toastrService.error('Failed to register user.');
    //   }

    // }else if(regUserExists.isRegistrationSuccess==false){
    //   this.openModal(); 
    // }
    // Step 3: Proceed with the registration process if the email is provided and user doesn't exist
   

  } catch (error) {
    console.log('Error during registration:', error);
    this.toastrService.error('An error occurred while registering the user.');
  }
}


openModal() {
  document.getElementById('showModal').click();
  this.startTimer();
}

async getRegUser(){

}
otpValidation(event:KeyboardEvent){
  // this.OtpResponseMessage=''
  const invalidChars =['+','-','.','e'];
  const inputElement= event.target as HTMLInputElement;
  if(invalidChars.includes(event.key)|| (inputElement.value.length==6 && event.key!='Backspace')||event.keyCode===40||event.keyCode===38)
  {
      // this.verifyButtonDisabled=false;
      event.preventDefault();
  }
}

}

