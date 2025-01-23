import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/app/environments/environment";
import { User } from "src/app/model/user.model";

@Injectable({
    providedIn:'root'
})

export class MainHeaderService{
    private userDetailsUrl = environment.apiURL+'/dr/user/get';
    private rgtrUserDetailsUrl = environment.apiURL+'/dr/rgtrUser/getUser';
    private uploadProfilePictureUrl = environment.apiURL+'/dr/user/upload-profile-picture';
    private resetUrl =  environment.apiURL+'/dr/user/reset-password';
    private oldUrl =  environment.apiURL+'/dr/user/check-oldpassword';
    private deleteProfilePictureUrl =  environment.apiURL+'/dr/user/deleteprofilepicture';
    constructor(private httpClient: HttpClient){}

    getUserDetailsById(userId: string): Observable<User> {
        return this.httpClient.get<User>(`${this.userDetailsUrl}/${userId}`);
    }
    getRgtrUserDetailsById(userId: string): Observable<User> {
      return this.httpClient.get<User>(`${this.rgtrUserDetailsUrl}/${userId}`);
  }

    uploadProfilePicture(userId: string, formData: FormData): Observable<Blob> {
        return this.httpClient.post(`${this.uploadProfilePictureUrl}/${userId}`, formData, {
            responseType: 'blob' 
        });
    }


    resetPassword(email: string, newPassword: string, confirmPassword: string): Observable<any> {
      if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    const params = new HttpParams()
      .set('userId', email)
      .set('newPassword', newPassword)
      .set('confirmPassword', confirmPassword); 
    return this.httpClient.post<any>(`${this.resetUrl}`, null, {
      params: params,
      observe: 'response'
    });
  }
  
  validateOldPassword(email: string, oldPassword: string): Observable<boolean> {
    // Prepare query parameters
    const params = new HttpParams()
      .set('userId', email)           // Pass userId (email) as query parameter
      .set('oldPassword', oldPassword); // Pass oldPassword as query parameter

    // Make HTTP POST request to the backend
    return this.httpClient.post<boolean>(this.oldUrl, null, { 
      params: params,
      observe: 'body'            // Since the response body will be a boolean, we can observe 'body' only
    });
  }
  deleteProfilePicture(userId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.deleteProfilePictureUrl}/${userId}`);
}
}
