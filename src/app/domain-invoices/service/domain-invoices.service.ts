import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable } from 'rxjs';
import { environment } from "src/app/environments/environment";
import { DomainInvoices } from "src/app/model/domain-invoices.model";


@Injectable({
    providedIn:'root'
})

export class DomainInvoiceService{
    private domainInvoiceUrl = environment.apiURL+'/dr/billingHistory/all';
    private invoiceDetailsURL = environment.apiURL+'/dr/invoice/all';

    constructor(private httpClient: HttpClient){}

   // Method to get all billing histories using GET
getAllBillingHistories(userId: string): Observable<DomainInvoices[]> {
    return this.httpClient.get<DomainInvoices[]>(this.domainInvoiceUrl+"?userId="+userId).pipe(
        catchError(error => {
            console.error('Error fetching billing histories:', error);
            throw error; 
        })
    );
}

getAllInvoiceDetails(){
    return this.httpClient.get<any[]>(`${this.invoiceDetailsURL}`,{observe: 'response',headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            }) })
}

   

}