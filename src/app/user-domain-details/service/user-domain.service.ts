import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Import HttpClient to make HTTP requests
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDomainService {
  private apiUrl = 'http://localhost:9002/dr/domain';  // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  // Method to send domain data to the backend
  sendDomainData(domainData: any): Observable<any> {
    return this.http.post(this.apiUrl, domainData);  // Replace with actual API URL
  }
}