import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {

  isDropdownOpen: boolean = false;
 
 
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

}
