import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(private http: HttpClient) { }

  private apiurl=environment.apiURL
  getInvoiceTemplateBlob(): Promise<Blob> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken') // If needed
    });

    return this.http.get(this.apiurl+'/dr/invoice/getInvoiceTemplate', { 
      responseType: 'blob',
      headers: headers // Include headers if authentication is required
    }).toPromise(); // Use toPromise() to convert Observable to Promise
  }
}