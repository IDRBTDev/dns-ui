import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user.model';
import { environment } from 'src/app/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordResetService {
  private resetPasswordUrl = environment.apiURL+'/dr/user/update';  

  constructor(private http: HttpClient) {}

  updatePassword(user: User): Observable<User> {
    const userDTO = {
      userId: user.userId,               
      encryptedPassword: user.encryptedPassword,
    };
      return this.http.put<any>(this.resetPasswordUrl, userDTO);
  }


}