import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; 
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
    const url = `${this.endpoints.organisationDetails}/getDetailsById/${organisationDetailsId}`;
    return this.http.get<any>(url);
  }

  /**
   * Fetch administrative contact details by ID.
   * @param organisationDetailsId The unique identifier for the organisation details.
   */
  getAdministrativeContact(organisationDetailsId: string): Observable<any> {
    const url = `${this.endpoints.administrativeContact}/getDetailsById/${organisationDetailsId}`;
    return this.http.get<any>(url);
  }

  /**
   * Fetch technical contact details by ID.
   * @param organisationDetailsId The unique identifier for the organisation details.
   */
  getTechnicalContact(organisationDetailsId: string): Observable<any> {
    const url = `${this.endpoints.technicalContact}/getDetailsById/${organisationDetailsId}`;
    return this.http.get<any>(url);
  }

  /**
   * Fetch billing contact details by ID.
   * @param organisationDetailsId The unique identifier for the organisation details.
   */
  getBillingContact(organisationDetailsId: string): Observable<any> {
    const url = `${this.endpoints.billingContact}/getDetailsById/${organisationDetailsId}`;
    return this.http.get<any>(url);
  }

  /**
   * Fetch name server details by ID.
   * @param organisationDetailsId The unique identifier for the organisation details.
   */
  getNameServerDetails(organisationDetailsId: string): Observable<any> {
    const url = `${this.endpoints.nameServer}/getDetailsById/${organisationDetailsId}`;
    return this.http.get<any>(url);
  }
}
