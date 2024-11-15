import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  showPassword: boolean | undefined;
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  email: string = ''; 
  showOtpButton: boolean = false;

  toggleOtpButton() {
   
    this.showOtpButton = this.email.length > 0; 
  }

  onFocus() {

    if (!this.showOtpButton && this.email.length > 0) {
      this.showOtpButton = true;
    }
  }

}
