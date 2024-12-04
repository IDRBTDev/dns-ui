declare var bootstrap: any;
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { error } from 'jquery';
import { HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
//import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { NotificationService } from './service/notification.service';
import { Notification } from '../model/Notification.model';
import TimeAgo from "javascript-time-ago";
declare var $: any;


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, AfterViewInit {

  @Input() modalId: string = '';
  @Input() isNotificationVisible: boolean = false;
  @Output() notificationToggle: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('notificationModal') notificationModal: ElementRef;

  notificationList: Notification[];
  notificationCount = 0;
  //userDetails : Users;

  constructor(
    private router: Router, private cdr :ChangeDetectorRef, private notificationService: NotificationService, private ngZone: NgZone){
      this.getNotificationsOfUser();
     // this.getAssignedUserProfile('Bharat@ikcontech.com')
  }

  ngOnInit(): void {
    this.getNotificationsOfUser();
    this.showModal(); // Call the modal show on component load
  }

  ngAfterViewInit() {
    setTimeout(() => {
      console.log(this.notificationModal);  // Should no longer be undefined
    });
  }

  /**
   * 
   */
  toggleVisibility(): void {
    this.isNotificationVisible = !this.isNotificationVisible;
    this.notificationToggle.emit(this.isNotificationVisible); // Notify the parent
  }
  getNotificationsOfUser(){
      //get top 10 notifications of user
    this.notificationService.getTopTenNotificationsByUserId(localStorage.getItem('email')).subscribe({
      next: response => {
        if(response.status === HttpStatusCode.Ok){
          this.notificationList = response.body;
          this.notificationCount = response.body.length;
          localStorage.setItem('notificationCount',this.notificationCount.toString())
          // this.notificationList.forEach(notification => {
          //    console.log(notification.profilepic)
          //    });
          //for each notification set time ago
          // this.notificationList.forEach(notification => {
          //   notification.timeAgoDateTime = new TimeAgo('en-US')
          //   notification.timeAgoDateTime.format(new Date(notification.createdDateTime))
          // });
        }
      },
      error: error => {
        if(error.status === HttpStatusCode.Unauthorized){
          //router tosession timeout
          this.router.navigateByUrl('/session-timeout')
        }
      }
    });
  }

  showModal() {
    if (this.notificationModal) {
      const modalElement = this.notificationModal.nativeElement;

      // Using ngZone to ensure Angular's change detection doesn't get in the way
      this.ngZone.run(() => {
        const modal = new bootstrap.Modal(modalElement, {
          backdrop: 'static', // Prevent closing on backdrop click
          keyboard: false,     // Prevent closing on ESC key
        });

        // Log when modal is being shown (useful for debugging)
        console.log('Modal is being shown');

        // Show the modal with the fade effect
        modal.show();
        
        // Apply the fade-in effect and ensure visibility
        modalElement.classList.add('show'); // Ensure 'show' class is added for visibility
        modalElement.style.display = 'block'; // Ensure it's displayed
        modalElement.style.opacity = '1'; // Ensure full opacity after displaying
      });
    }
  }


 /**
  * 
  * @param notification 
  */
  updateNotificationStatus(notification: Notification){
    if(notification.status === 'Unread'){
      this.notificationService.updateNotification(notification).subscribe({
        next: response => {
          if(response.status === HttpStatusCode.PartialContent){
          }
        },error: error => {
          if(error.status === HttpStatusCode.Unauthorized){
            this.router.navigateByUrl('/session-timeout');
          }
        }
      })
    }
    
  }

  /**
   * 
   * @param email 
   */
  // getAssignedUserProfile(email : string){
  //   this.headerService.fetchUserProfile(email).subscribe({
  //     next : response =>{
  //       this.userDetails = response.body;
  //     }

  //   })

  // }

  /**
   * 
   * @param profilePic 
   * @returns 
   */
  getProfilePicUrl(profilePic: string): string {
     try {
      //Assuming profilePic is a valid Base64 string
      return 'data:image/jpg;base64,'+ profilePic;
     } catch (error) {
       console.error('Error creating profile pic URL:', error);
          return ''; // or a default URL
     }
  }
 
}