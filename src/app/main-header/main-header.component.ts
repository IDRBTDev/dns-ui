import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { MainHeaderService } from './service/main-header.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit{

  user: User | null = null;  
  loading: boolean = true;    
  error: string = '';
  isNotificationVisible = false;
  notificationModalId = 'notificationModal';

  @ViewChild('fileInput') fileInput: any;
  
  @ViewChild(NotificationComponent) notificationComponent: NotificationComponent;
  constructor(private router: Router, private mainHeaderService: MainHeaderService,){}

  ngOnInit(): void {
     this.getUserDetails(); 
    const storedProfilePictureUrl = localStorage.getItem('profilePictureUrl');
    if (storedProfilePictureUrl) {
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
  
  toggleNotification(): void {
    this.isNotificationVisible = !this.isNotificationVisible;
  }
  onNotificationToggle(value: boolean): void {
    this.isNotificationVisible = value; 
  }

  logout(){
    localStorage.clear();
    this.router.navigateByUrl('/login').then(() => {
      
      window.location.reload();
    });
  }
  notifications(){
    if (this.notificationComponent) {
      this.notificationComponent.showModal();
    }
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

deleteProfilePicture(): void {
  if (this.user && this.user.userId) {
    this.mainHeaderService.deleteProfilePicture(this.user.userId).subscribe(
      () => {
        this.user.profilePicture = null;
        this.user.profilePictureUrl = null;
        localStorage.removeItem('profilePictureUrl');
        console.log('Profile picture deleted successfully.');
      },
      (error) => {
        console.error('Error deleting profile picture:', error);
      }
    );
  }
}

  

}