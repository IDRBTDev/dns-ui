import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { MainHeaderService } from './service/main-header.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit{

  user: User | null = null;  // Store user details
  loading: boolean = true;    // Loading flag for fetching data
  error: string = '';

  constructor(private router: Router, private mainHeaderService: MainHeaderService,){}

  ngOnInit(): void {
    this.getUserDetailsById();
   
  }

  cancelButton(){
    setTimeout(() => {
      
    }, 200);
    window.location.reload();
  }
  
  

  logout(){
    localStorage.clear();
    this.router.navigateByUrl('/login').then(() => {
      // Reload the page after navigation
      window.location.reload();
    });
  }

  onImageLoad() {
    console.log("Profile image successfully loaded into the DOM.");
  }  

  getUserDetailsById(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.mainHeaderService.getUserDetailsById(userId).subscribe(
        (data: User) => {
          this.user = data;
          this.loading = false; 
        },
        (error) => {
          this.error = 'Error fetching user details.';
          this.loading = false; 
          console.error('Error fetching user details:', error);
        }
      );
    } else {
      this.error = 'User ID not found in localStorage.';
      this.loading = false;
    }
  }

}
