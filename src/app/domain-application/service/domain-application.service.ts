import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DomainApplicationService {
    constructor(private http: HttpClient) {}
   // private apiUrl = environment.apiURL+'/payment/documentUpload';
    private apiUrl1 = 'http://localhost:9002'+'/dr/payment'
    processPayment(): Observable<string[]> {   
      return this.http.post<string[]>(`${this.apiUrl1}`, {}); 
    }
    private url = 'https://test.sbiepay.sbi/secure/AggregatorHostedListener';
  submitPayment(data: any): Observable<any> {
    // custom headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:4200',
      'Referer': 'http://localhost:4200',
    });
 
    return this.http.post(this.url, data, { headers });
  }
}