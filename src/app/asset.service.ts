import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(private http: HttpClient) { }

  getInvoiceTemplate(): Observable<Blob> {
    return this.http.get('private-assets/templates/Invoicetemplate.docx', { responseType: 'blob' });
  }

  getInvoicePDF(domain: any): Observable<Blob> {
    return this.http.post('/api/generateInvoicePDF', domain, { responseType: 'blob' });
  }
}