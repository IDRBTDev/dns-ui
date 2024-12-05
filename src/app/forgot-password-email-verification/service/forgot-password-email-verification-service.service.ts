import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user.model';


@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  private verifyemailurl = 'http://localhost:9002/dr/user/verify-user';

  constructor(private http: HttpClient) {}

  // Method to verify if the user exists
  verifyEmail(userId: string): Observable<User> {
    return this.http.get<User>(`${this.verifyemailurl}/${userId}`);
  }
}
