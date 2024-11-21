import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable } from 'rxjs';
import { DomainInvoices } from "src/app/model/domain-invoices.model";


@Injectable({
    providedIn:'root'
})

export class DomainInvoiceService{
    private domainInvoiceUrl = 'http://localhost:9002/dr/billingHistory/all';

    constructor(private httpClient: HttpClient){}

   // Method to get all billing histories using GET
   getAllBillingHistories(): Observable<DomainInvoices[]> {
    return this.httpClient.get<DomainInvoices[]>(this.domainInvoiceUrl).pipe(
        catchError(error => {
            console.error('Error fetching billing histories:', error);
            throw error; 
        })
    );
}

   

}