import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-session-timeout',
  templateUrl: './session-timeout.component.html',
  styleUrls: ['./session-timeout.component.css']
})
export class SessionTimeoutComponent implements OnInit {

  ngOnInit(): void {
    localStorage.clear();
    window.localStorage.clear();
    sessionStorage.clear();
  }
}
