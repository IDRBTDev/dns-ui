import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user.model';


@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordEmailVerificationService {

  private verifyemailUrl = 'http://localhost:9002/dr/user/verify-user';
  private getOtpUrl = 'http://localhost:9002/dr/user/get-otp';
 

  constructor(private http: HttpClient) {}

  verifyUserEmail(userId: string): Observable<string[]> {
    return this.http.get<any>(`${this.verifyemailUrl}/${userId}`);
  }

  getOtpForUser(userId: string): Observable<number> {
    return this.http.get<number>(`${this.getOtpUrl}/${userId}`);
  }

 
}
