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

  user: User | null = null;  
  loading: boolean = true;    
  error: string = '';

  constructor(private router: Router, private mainHeaderService: MainHeaderService,){}

  ngOnInit(): void {
     this.getUserDetails();  
   }
   
    cancelButton(){
    setTimeout(() => {
      
    }, 200);
    window.location.reload();
  }
  
  

  logout(){
    localStorage.clear();
    this.router.navigateByUrl('/login').then(() => {
      
      window.location.reload();
    });
  }

  onImageLoad() {
    console.log("Profile image successfully loaded into the DOM.");
  }  

  getUserDetails() {  
      this.mainHeaderService.getUserDetailsById(localStorage.getItem('email')).subscribe(
        response => {
          console.log('User data received from API:', response);
          this.user=response
         
          this.loading = false; 
        },
        (error) => {
          this.error = 'Error fetching user details.';
          this.loading = false; 
          console.error('Error fetching user details:', error);
        }
      );

  }

}
