import { Component } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  email: string = '';
  showEmailButton: boolean = false; 
showNumberButton:boolean=false;
phn:String='';
  toggleEmailButton() {
    
    this.showEmailButton = this.email.length > 0;
  }

  onFocus() {
   
    if (!this.showEmailButton && this.email.length > 0) {
      this.showEmailButton = true;
    }
  }
  toggleNumberButton() {
 
    this.showNumberButton = this.phn.length > 0; 
  }

  onFocus1() {
   
    if (!this.showNumberButton && this.phn.length > 0) {
      this.showNumberButton = true;
    }
  }

}
