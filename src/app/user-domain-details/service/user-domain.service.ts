import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';  // Import HttpClient to make HTTP requests
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserDomainService {
  private apiUrl = environment.apiURL+'/dr/domain';  // Replace with your actual API endpoint
private domainurl=environment.apiURL+'/dr/domain/validateReservedDomain';
  constructor(private http: HttpClient) {}

  // Method to send domain data to the backend
  sendDomainData(domainData: any): Observable<any> {
    return this.http.post(this.apiUrl, domainData);  // Replace with actual API URL
  }
  validateReservedDomain(zone: string, label: string): Observable<boolean> {
    const params = new HttpParams().set('zone', zone).set('label', label);
    return this.http.get<boolean>(this.domainurl, { params });
  }
}