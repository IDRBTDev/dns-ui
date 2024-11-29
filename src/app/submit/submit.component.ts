import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css'],
})
export class SubmitComponent implements OnInit {
  domainDetails: Array<{ domainName: string; term: string; requestedOn: string; currentStatus: string; requestNo: string }> = [];
  loginResponse: { userId: string; password: string } | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDomainDetails();
    this.fetchLoginResponse();
  }

  fetchDomainDetails() {
    // Replace with your actual API endpoint
    this.http.get<any>('http://localhost:9000/api/domainDetails').subscribe({
      next: (data) => {
        this.domainDetails = data;
      },
      error: (error) => {
        console.error('Error fetching domain details:', error);
      },
    });
  }

  fetchLoginResponse() {
    // Replace with your actual API endpoint
    this.http.get<any>('http://localhost:9000/api/loginResponse').subscribe({
      next: (data) => {
        this.loginResponse = data;
      },
      error: (error) => {
        console.error('Error fetching login response:', error);
      },
    });
  }
}
