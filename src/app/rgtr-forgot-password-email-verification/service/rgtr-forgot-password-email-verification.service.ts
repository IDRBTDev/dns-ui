import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RgtrForgotPasswordEmailVerificationService {

  private verifyemailUrl = environment.apiURL+'/dr/rgtrUser/verify-user';
  private getOtpUrl = environment.apiURL+'/dr/rgtrUser/get-otp';
 

  constructor(private http: HttpClient) {}

  verifyUserEmail(userId: string): Observable<string[]> {
    console.log("entered")
    return this.http.get<any>(`${this.verifyemailUrl}/${userId}`);
  }

  getOtpForUser(userId: string): Observable<number> {
    return this.http.get<number>(`${this.getOtpUrl}/${userId}`);
  }

}
