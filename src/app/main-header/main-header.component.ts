import { Component, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('fileInput') fileInput: any;
  

  constructor(private router: Router, private mainHeaderService: MainHeaderService,){}

  ngOnInit(): void {
     this.getUserDetails(); 
     // Retrieve the stored profile picture URL from localStorage and set it
    const storedProfilePictureUrl = localStorage.getItem('profilePictureUrl');
    if (storedProfilePictureUrl) {
        // Make sure 'user' is initialized before setting the profile picture URL
        if (this.user) {
            this.user.profilePictureUrl = storedProfilePictureUrl;
        }
    }
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

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onChangeFile(event: any): void {
    if (event.target.files.length > 0) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        this.mainHeaderService.uploadProfilePicture(localStorage.getItem('email')!, formData).subscribe(
            (response: Blob) => {
                this.user.profilePicture = response;  
                this.user.profilePictureUrl = URL.createObjectURL(response);  
                localStorage.setItem('profilePictureUrl', this.user.profilePictureUrl);
                window.location.reload()
                console.log('Profile picture uploaded successfully');
            },
            (error) => {
                console.error('Error uploading profile picture', error);
            }
        );
    }
}

  

}
