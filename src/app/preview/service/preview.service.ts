import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root',
})


export class PreviewService {
  private endpoints = {
    organisationDetails: 'http://localhost:9010/dr/organisationDetails',
    administrativeContact: 'http://localhost:9005/dr/administrativeContact',
    technicalContact: 'http://localhost:9005/dr/technicalContact',
    billingContact: 'http://localhost:9005/dr/billingContact',
    nameServer: 'http://localhost:9009/dr/nameServer',
  };

  constructor(private http: HttpClient) {}

  /**
   * Fetch organisation details by ID.
   * @param organisationDetailsId The unique identifier for the organisation details.
   */
  getOrganisationDetails(organisationDetailsId: string): Observable<any> {
     const headers = new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
              });
    const url = `${this.endpoints.organisationDetails}/get/${organisationDetailsId}`;
    return this.http.get<any>(url,{headers});
  }

  /**
   * Fetch administrative contact details by ID.
   * @param organisationDetailsId The unique identifier for the organisation details.
   */
  getAdministrativeContact(organisationDetailsId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    });
    const url = `${this.endpoints.administrativeContact}/get/${organisationDetailsId}`;
    return this.http.get<any>(url,{headers});
  }

  /**
   * Fetch technical contact details by ID.
   * @param organisationDetailsId The unique identifier for the organisation details.
   */
  getTechnicalContact(organisationDetailsId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    });
    const url = `${this.endpoints.technicalContact}/get/${organisationDetailsId}`;
    return this.http.get<any>(url,{headers});
  }

  /**
   * Fetch billing contact details by ID.
   * @param organisationDetailsId The unique identifier for the organisation details.
   */
  getBillingContact(organisationDetailsId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    });
    const url = `${this.endpoints.billingContact}/get/${organisationDetailsId}`;
    return this.http.get<any>(url,{headers});
  }

  /**
   * Fetch name server details by ID.
   * @param organisationDetailsId The unique identifier for the organisation details.
   */
  getNameServerDetails(organisationDetailsId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    });
    const url = `${this.endpoints.nameServer}/get/${organisationDetailsId}`;
    return this.http.get<any>(url,{headers});
  }
}
