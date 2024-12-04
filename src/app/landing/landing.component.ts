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
    this.slideInterval = setInterval(() => {
      this.changeSlide();
    }, 2000);  // Change the slide every 5 seconds
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
  domainExtension: string = '';  // Holds the current domain extension being typed
  extensions: string[] = ['.com', '.bank.in', '.fin.in'];  // Array of domain extensions to cycle through
  currentExtensionIndex: number = 0;  // To track the current extension being displayed
  isTyping: boolean = true;  // Flag to indicate whether we are typing or deleting
  typingInterval: any;  // Holds the interval reference for the typing effect
  index: number = 0;  // To track the current position in the current extension
// Time to type/delete each character (in ms)
  startTypingEffect(): void {
    this.typingInterval = setInterval(() => {
      const currentExtension = this.extensions[this.currentExtensionIndex];  // Get the current extension to display

      if (this.isTyping) {
        // Typing phase: Add one character at a time
        this.domainExtension = currentExtension.substring(0, this.index + 1);
        this.index++;

        // If the full extension is typed, switch to deleting phase
        if (this.index === currentExtension.length) {
          this.isTyping = false;
        }
      } else {
        // Deleting phase: Remove one character at a time
        this.domainExtension = currentExtension.substring(0, this.index - 1);
        this.index--;

        // If all characters are deleted, switch to typing phase and move to next extension
        if (this.index === 0) {
          this.isTyping = true;
          this.currentExtensionIndex = (this.currentExtensionIndex + 1) % this.extensions.length; // Cycle through extensions
        }
      }
    }, 300); // Adjust the speed of typing/deleting (150ms in this case)
  }

  // Stop the typing effect if needed (optional method)
  stopTypingEffect(): void {
    clearInterval(this.typingInterval);
  }
 isChevronRotated: boolean = false;

  // Boolean to track the dropdown menu visibility
  isDropdownVisible: boolean = false;

  // Toggle Chevron icon rotation
  toggleChevronRotation() {
    this.isChevronRotated = !this.isChevronRotated;
  }

  // Toggle dropdown menu visibility
  toggleDropdownMenu() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
  ngOnDestroy(): void {
    // Cleanup the interval when the component is destroyed
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  // Slide Interval Logic
  currentIndex: number = 0;
  totalSlides: number = 2;  // Number of slides
  slideInterval: any;  // To hold the slide change interval

  slides: { title: string, description: string, features: string[] }[] = [
    {
      title: 'New Security Enhancement Rollout',
      description: 'We\'re excited to announce our latest security protocols for domain registration...',
      features: ['Advanced real-time threat monitoring', 'Enhanced multi-factor authentication', 'Comprehensive domain protection mechanisms', 'Continuous security updates and intelligence']
    },
    {
      title: 'New Hello Enhancement Rollout',
      description: 'We\'re thrilled to introduce our new domain registration protocols...',
      features: ['Real-time fraud detection', 'Advanced authentication technology', 'Enhanced protection protocols', '24/7 monitoring and updates']
    }
  ];

  // Method to change the slide
  changeSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;  // Loop back to 0 when reaching the end
  }
}

