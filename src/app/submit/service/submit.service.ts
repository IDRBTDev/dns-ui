import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubmitService {
  private userDomainUrl = 'http://localhost:9002/user-domain'; // Replace with the actual URL
  private organisationUrl = 'http://localhost:9002/organisation'; // Replace with the actual URL

  constructor(private http: HttpClient) {}

  // Fetch user domain details
  getUserDomainDetails(): Observable<any> {
    return this.http.get<any>(this.userDomainUrl); // Replace with the correct API endpoint
  }

  // Fetch organisation details
  getOrganisationDetails(): Observable<any> {
    return this.http.get<any>(this.organisationUrl); // Replace with the correct API endpoint
  }
}
