import { Component } from '@angular/core';
import { LoginService } from './service/login.service';
import { lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private loginService: LoginService,
    private toastr: ToastrService, private router: Router
  ){

  }

  showPassword: boolean | undefined;
  email: string = ''; 
  showOtpButton: boolean = false;
  otp: number ;

  user = {
    email: '',
    password: '',
    loginCity:'',
    loginState:'',
    loginCountry: ''
  }

  async login(){
    //this.user.email = this.email;
    await lastValueFrom(this.loginService.userLoginToDR(this.user)).then(
      response => {
        this.router.navigateByUrl('/home');
        this.toastr.success('Login Success')
      }
    )
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleOtpButton() {
   
    this.showOtpButton = this.email.length > 0; 
  }

  onFocus() {

    if (!this.showOtpButton && this.email.length > 0) {
      this.showOtpButton = true;
    }
  }

}
