import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private router: Router){}
  ngOnInit(): void {
 
      this.startTypingEffect();
   
  }

  isDropdownOpen: boolean = false;
 
 
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateToLogin(){
    this.router.navigateByUrl('/login')
  }

  navigateToregister(){
    this.router.navigateByUrl('/registration');
  }
  domainExtension: string = ''; 
  extensions: string[] = ['.com', '.bank.in', '.fin.in'];  
  currentExtensionIndex: number = 0; 
  isTyping: boolean = true;
  typingInterval: any; 
  index: number = 0;

  startTypingEffect(): void {
    this.typingInterval = setInterval(() => {
      const currentExtension = this.extensions[this.currentExtensionIndex];

      if (this.isTyping) {
      
        this.domainExtension = currentExtension.substring(0, this.index + 1);
        this.index++;

        if (this.index === currentExtension.length) {
          this.isTyping = false;
        }
      } else {
        
        this.domainExtension = currentExtension.substring(0, this.index - 1);
        this.index--;

        if (this.index === 0) {
          this.isTyping = true;
          this.currentExtensionIndex = (this.currentExtensionIndex + 1) % this.extensions.length; 
        }
      }
    }, 300); }

  stopTypingEffect(): void {
    clearInterval(this.typingInterval);
  }
 isChevronRotated: boolean = false;

  isDropdownVisible: boolean = false;

  toggleChevronRotation() {
    this.isChevronRotated = !this.isChevronRotated;
  }

  toggleDropdownMenu() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  activeSlideIndex: number = 0;

  onSlideChange(event: any): void {
 
    this.activeSlideIndex = event.to;
  }

  getSvgTransformStyle(): string {
    switch (this.activeSlideIndex) {
      case 0:
        return 'translateX(-50%)'; 
      case 1:
        return 'translateX(-40%)'; 
      case 2:
        return 'translateX(-60%)';
      default:
        return 'translateX(-50%)'; 
    }
  }

}

