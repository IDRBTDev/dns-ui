import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable } from 'rxjs';
import { environment } from "src/app/environments/environment";
import { DomainInvoices } from "src/app/model/domain-invoices.model";

@Injectable({
  providedIn: 'root'
})
export class AdminInvoiceDetailsService {

  private adminInvoiceDetailsUrl = environment.apiURL+'/dr/billingHistory';

  constructor(private httpClient: HttpClient) {}

  getBillingHistoryById(billingId: number): Observable<DomainInvoices> {
    return this.httpClient.get<DomainInvoices>(`${this.adminInvoiceDetailsUrl}/getBillingHistoryById/${billingId}`).pipe(
      catchError(error => {
        console.error('Error fetching billing history by ID:', error);
        throw error;
      })
    );
  }
}
