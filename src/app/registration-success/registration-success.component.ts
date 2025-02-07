import { Component } from '@angular/core';

@Component({
  selector: 'app-registration-success',
  templateUrl: './registration-success.component.html',
  styleUrls: ['./registration-success.component.css']
})
export class RegistrationSuccessComponent {
  isHighlighted: boolean = false;  // Variable to toggle the highlight

  // Method to toggle the button highlight
  toggleHighlight(): void {
    this.isHighlighted = !this.isHighlighted;
  }
}
