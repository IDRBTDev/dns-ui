import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordOtpValidationService {

  private verifyOtpUrl = 'http://localhost:9002/dr/user/verify-otp'; 
  private getOtpUrl = 'http://localhost:9002/dr/user/get-otp';

  constructor(private http: HttpClient) {}

  verifyOtp(userId: string, otp: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.verifyOtpUrl}/${userId}/${otp}`);
  }

 resendOtp(userId: string): Observable<number> {
    return this.http.get<number>(`${this.getOtpUrl}/${userId}`);
  }
}
