import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs'; 
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})


export class PreviewService {
  private apiEnvironmentUrl= environment.apiURL;
  private endpoints = {
    organisationDetails: this.apiEnvironmentUrl+'/dr/organisationDetails',
    administrativeContact: this.apiEnvironmentUrl+'/dr/administrativeContact',
    technicalContact: this.apiEnvironmentUrl+'/dr/technicalContact',
    billingContact: this.apiEnvironmentUrl+'/dr/billingContact',
    nameServer: this.apiEnvironmentUrl+'/dr/nameServer',
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
