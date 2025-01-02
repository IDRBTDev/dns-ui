declare var bootstrap: any;
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { error } from 'jquery';
import { HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { NotificationService } from './service/notification.service';
import { Notification } from '../model/Notification.model';

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

  notificationList: any[] = [];
  notificationCount = 0;
  userMailId = localStorage.getItem('email');
  notificationError: string | null = null;

  private notificationSubscription: Subscription;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadNotifications(); // Load initial notifications
    this.setupNotificationPolling(); // Start polling
    this.showModal(); // Show the modal if applicable
  }

  ngAfterViewInit() {
    setTimeout(() => {
      console.log(this.notificationModal); // Debugging modal visibility
    });
  }

  ngOnDestroy(): void {
    // Cleanup polling subscription to avoid memory leaks
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  toggleVisibility(): void {
    this.isNotificationVisible = !this.isNotificationVisible;
    this.notificationToggle.emit(this.isNotificationVisible); // Notify parent
    
  }

  loadNotifications(): void {
    if (this.userMailId) {
      this.notificationService.getNotifications(this.userMailId).subscribe(
        (notifications: any[]) => {
          this.notificationList = notifications; // Update the notification list
          this.notificationCount = notifications.filter(n => n.status === 'Unread').length; // Update unread count
          this.cdr.detectChanges(); // Ensure view updates
          this.notificationError = null;
          // console.log('Notifications loaded:', this.notificationList);
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

  markAllNotificationsAsRead(): void {
    this.notificationService.markAllAsRead(this.userMailId).subscribe(() => {
      this.notificationList.forEach((notification) => (notification.status = 'Read'));
      this.notificationCount = 0; // Reset unread count
      this.cdr.detectChanges(); // Trigger view update
    });
  }


  updateNotificationStatus(notification: Notification): void {
    if (notification.status === 'Unread') {
      this.notificationService.updateNotification(notification).subscribe({
        next: (response) => {
          if (response.status === HttpStatusCode.PartialContent) {
            this.loadNotifications(); // Refresh notifications after update
          }
        },
        error: (error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigateByUrl('/session-timeout');
          }
        }
      });
    }
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
        this.markAllNotificationsAsRead();

        modalElement.classList.add('show'); // Ensure 'show' class is added
        modalElement.style.display = 'block'; // Ensure it's displayed
        modalElement.style.opacity = '1'; // Ensure full opacity
      });
    }
  }
}
