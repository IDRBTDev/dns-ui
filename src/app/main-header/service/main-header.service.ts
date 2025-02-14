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
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
      });
        return this.httpClient.get<User>(`${this.userDetailsUrl}/${userId}`,{headers});
    }
    getRgtrUserDetailsById(userId: string): Observable<User> {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
      });
      return this.httpClient.get<User>(`${this.rgtrUserDetailsUrl}/${userId}`,{headers});
    }

    uploadProfilePicture(userId: string, formData: FormData): Observable<Blob> {
        return this.httpClient.post(`${this.uploadProfilePictureUrl}/${userId}`, formData, {
            responseType: 'blob' 
        });
    }


  //   resetPassword(email: string, newPassword: string, confirmPassword: string): Observable<any> {
  //     const headers = new HttpHeaders({
  //       'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
  //     });
  //     if (newPassword !== confirmPassword) {
  //     throw new Error('Passwords do not match');
  //   }
  //   const params = new HttpParams()
  //     .set('userId', email)
  //     .set('newPassword', newPassword)
  //     .set('confirmPassword', confirmPassword); 
  //   return this.httpClient.post<any>(`${this.resetUrl}`, null, {
  //     headers: headers,
  //     params: params,
  //     observe: 'response'
  //   });
  // }
  resetPassword(email: string, newPassword: string, confirmPassword: string): Observable<string> {
    // Set authorization headers (if needed, replace with your token)
    const token = localStorage.getItem('jwtToken')?localStorage.getItem('jwtToken'):localStorage.getItem('tempTok');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Prepare the parameters for the POST request
    const params = new HttpParams()
      .set('userId', email)
      .set('newPassword', newPassword)
      .set('confirmPassword', confirmPassword);

    return this.httpClient.post<string>(this.resetUrl, null, {
      headers: headers,
      params: params,
     responseType: 'text' as 'json'
    });
  }

  
  // validateOldPassword(email: string, oldPassword: string): Observable<boolean> {
  //   const headers = new HttpHeaders({
  //     'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
  //   });
  //   // Prepare query parameters
  //   const params = new HttpParams()
  //     .set('userId', email)           // Pass userId (email) as query parameter
  //     .set('oldPassword', oldPassword); // Pass oldPassword as query parameter

  //   // Make HTTP POST request to the backend
  //   return this.httpClient.post<boolean>(this.oldUrl, null, { 
  //     headers: headers,
  //     params: params,
  //     observe: 'body'            // Since the response body will be a boolean, we can observe 'body' only
  //   });
  // }
  validateOldPassword(userId: string, oldPassword: string): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    });
    const params = new HttpParams()
      .set('userId', userId)
      .set('oldPassword', oldPassword);
  
    return this.httpClient.post<string>(this.oldUrl, null, {
      params: params,
      observe: 'body',
      responseType: 'text' as 'json'  // Set responseType to 'text'
    });
  }
  
  deleteProfilePicture(userId: string): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    });
    return this.httpClient.delete<void>(`${this.deleteProfilePictureUrl}/${userId},`,{headers});
}
}
