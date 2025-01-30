import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { User } from 'src/app/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class RgtrForgotPasswordResetService {
private resetPasswordUrl = environment.apiURL+'/dr/rgtrUser/update/pwd';  

  constructor(private http: HttpClient) {}

  updatePassword(user: User): Observable<User> {
    const userDTO = {
      userId: user.userId,               
      encryptedPassword: user.encryptedPassword,
    };
      return this.http.put<any>(this.resetPasswordUrl, userDTO);
  }

}
