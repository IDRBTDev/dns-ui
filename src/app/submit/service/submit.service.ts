import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubmitService {
  private userDomainUrl = environment.apiURL+'/user-domain'; // Replace with the actual URL
  private organisationUrl = environment.apiURL+'/organisation'; // Replace with the actual URL

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
