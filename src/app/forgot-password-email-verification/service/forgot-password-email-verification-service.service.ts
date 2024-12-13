import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user.model';
import { environment } from 'src/app/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordEmailVerificationService {

  private verifyemailUrl = environment.apiURL+'/dr/user/verify-user';
  private getOtpUrl = environment.apiURL+'/dr/user/get-otp';
 

  constructor(private http: HttpClient) {}

  verifyUserEmail(userId: string): Observable<string[]> {
    return this.http.get<any>(`${this.verifyemailUrl}/${userId}`);
  }

  getOtpForUser(userId: string): Observable<number> {
    return this.http.get<number>(`${this.getOtpUrl}/${userId}`);
  }

 
}
