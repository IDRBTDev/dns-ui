import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactDetailsFormService {
  // Replace these URLs with your actual API endpoints
  // private adminApiUrl = 'http://localhost:9010/dr/adminContact';
  // private techApiUrl = 'http://localhost:9010/dr/techContact';
  // private billApiUrl = 'http://localhost:9010/dr//billContact';

  private adminApiUrl = 'http://localhost:9005/dr/administrativeContact';



  private techApiUrl = 'http://localhost:9005/dr/technicalContact';



  private billApiUrl = 'http://localhost:9005/dr/billingContact';


  constructor(private http: HttpClient) {}

  // Save Admin Contact Details
  saveAdminDetails(adminData: any): Observable<any> {
    console.log('Sending Admin Details:', adminData);
    return this.http.post(this.adminApiUrl, adminData);
  }

  // Save Technical Contact Details
  saveTechDetails(techData: any): Observable<any> {
    return this.http.post(this.techApiUrl, techData);
  }

  // Save Billing Contact Details
  saveBillDetails(billData: any): Observable<any> {
    return this.http.post(this.billApiUrl, billData);
  }
}