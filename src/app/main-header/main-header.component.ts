import { Component, OnInit, ViewChild, ChangeDetectorRef,  ElementRef,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { MainHeaderService } from './service/main-header.service';
import { NotificationComponent } from '../notification/notification.component';
import { NotificationService } from '../notification/service/notification.service';
import { interval, Subscription } from 'rxjs';

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
  notificationCount: number = 0; 
  notificationList: any[] = []; 
  userMailId = localStorage.getItem('email');
  notificationError: string | null = null;
  private notificationSubscription: Subscription;


  @ViewChild('fileInput') fileInput: any;
  
  @ViewChild(NotificationComponent) notificationComponent: NotificationComponent;
  constructor(private router: Router, private mainHeaderService: MainHeaderService,private notificationService: NotificationService, 
    private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
     this.getUserDetails(); 
     this.setupNotificationPolling();
     this.notificationComponent.loadNotifications();
    const storedProfilePictureUrl = localStorage.getItem('profilePictureUrl');
    if (storedProfilePictureUrl) {
        if (this.user) {
            this.user.profilePictureUrl = storedProfilePictureUrl;
        }
    }
    this.loadNotifications();
   }
   ngOnDestroy(): void {
    // Cleanup polling subscription to avoid memory leaks
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }


   loadNotifications(): void {
    if (this.userMailId) {
      this.notificationService.getNotifications(this.userMailId).subscribe(
        (notifications: any[]) => {
          this.notificationList = notifications; 
          this.notificationCount = notifications.filter(n => n.status === 'Unread').length; 
          this.cdr.detectChanges(); 
          this.notificationError = null;
          console.log('Notifications loaded:', this.notificationList);
        },
        (error) => {
          this.notificationError = 'Error fetching notifications: ' + error.message;
          console.error('Error fetching notifications:', error);
        }
      );
    }
  }

  setupNotificationPolling(): void {
    // Poll every 30 seconds for notification updates
    this.notificationSubscription = interval(5000).subscribe(() => {
      this.loadNotifications();
    });
  }

    cancelButton(){
    setTimeout(() => {
      
    }, 200);
    window.location.reload();
  }
  
  toggleNotification(): void {
    this.isNotificationVisible = !this.isNotificationVisible;
    if (this.isNotificationVisible) {
      console.log('Notification Modal opened, marking notifications as read...');
      
      // Ensure userMailId exists before calling the service
      if (this.userMailId) {
        this.markNotificationsAsRead(this.userMailId); // Call the function to mark as read
      } else {
        console.error('User email is not available.');
      }
    }
  }
  markNotificationsAsRead(emailId: string): void {
    console.log('Calling markAllAsRead service for emailId:', emailId);
    this.notificationService.markAllAsRead(emailId).subscribe(
      (response) => {
        console.log('All notifications marked as read:', response);
        this.notificationCount = 0; // Reset the notification count
        // Update notification status locally
        this.notificationList.forEach(notification => {
          notification.status = 'Read'; // Update status locally
        });
      },
      (error) => {
        console.error('Error marking notifications as read:', error);
      }
    );
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
  // notifications(){
  //   if (this.notificationComponent) {
  //     this.notificationComponent.showModal();
  //   }
  // }


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