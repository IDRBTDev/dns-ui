import { Component, OnInit } from '@angular/core';

declare var bootstrap: any;  // Bootstrap JS library

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent implements OnInit {

  private modal: any;

  constructor() { }

  ngOnInit(): void {
  }

  // Open the modal
  openModal(): void {
    const modalElement = document.getElementById('reminderModal');
    this.modal = new bootstrap.Modal(modalElement); // Create modal instance
    this.modal.show(); // Show modal
  }

  // Close the modal
  closeModal(): void {
    if (this.modal) {
      this.modal.hide(); // Hide the modal
    }
  }
}