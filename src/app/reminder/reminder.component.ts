import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var bootstrap: any;  // Bootstrap JS library

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent implements OnInit {

  private modal: bootstrap.Modal | null = null;

  constructor(private router:Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("jwtToken")==null){
      this.router.navigateByUrl("/login")
    }
    if(localStorage.getItem("jwtToken")!=null){
      const modalElement = document.getElementById('reminderModal');
      if (modalElement) {
        this.modal = new bootstrap.Modal(modalElement,{backdrop: "static", Keyboard: "false"})
      }
      this.openModal();
    } 
  }

  // Open the modal
  openModal(): void {
    this.modal.show(); // Show modal
  }

  // Close the modal
  closeModal(): void {
    if (this.modal) {
      this.modal.hide(); // Hide the modal
    }
  }
}