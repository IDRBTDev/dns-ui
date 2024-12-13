import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordOtpValidationService {

  private verifyOtpUrl = environment.apiURL+'/dr/user/verify-otp'; 
  private getOtpUrl = environment.apiURL+'/dr/user/get-otp';

  constructor(private http: HttpClient) {}

  verifyOtp(userId: string, otp: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.verifyOtpUrl}/${userId}/${otp}`);
  }

 resendOtp(userId: string): Observable<number> {
    return this.http.get<number>(`${this.getOtpUrl}/${userId}`);
  }
}
