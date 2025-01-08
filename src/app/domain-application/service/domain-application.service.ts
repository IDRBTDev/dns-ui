import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DomainApplicationService {
    constructor(private http: HttpClient) {}
   // private apiUrl = environment.apiURL+'/payment/documentUpload';
    private apiUrl1 = 'http://localhost:9018'+'/payment'

    proccessPayment(payment): Observable<any> {
        // console.log(status)
       return this.http.post<any>(`${this.apiUrl1}`,payment);
     }

}