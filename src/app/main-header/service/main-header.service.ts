import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "src/app/model/user.model";

@Injectable({
    providedIn:'root'
})

export class MainHeaderService{
    private userDetailsUrl = 'http://localhost:9002/dr/user/get';
    private uploadProfilePictureUrl = 'http://localhost:9002/dr/user/upload-profile-picture';
    private resetUrl = 'http://localhost:9002/dr/user/reset-password';
    private oldUrl = 'http://localhost:9002/dr/user/check-oldpassword';
    constructor(private httpClient: HttpClient){}

    // Method to fetch user details based on userId (now a string)
    getUserDetailsById(userId: string): Observable<User> {
        return this.httpClient.get<User>(`${this.userDetailsUrl}/${userId}`);
    }

    // Method to upload the profile picture
    uploadProfilePicture(userId: string, formData: FormData): Observable<Blob> {
        return this.httpClient.post(`${this.uploadProfilePictureUrl}/${userId}`, formData, {
            responseType: 'blob' 
        });
    }

    resetPassword( userId:string,newPassword: string,  confirmPassword: string): Observable<boolean> {
        const body = {
            userId:userId,
           
          newPassword: newPassword,
          confirmPassword: confirmPassword
        };
    
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
        // Send POST request to backend to reset the password
        return this.httpClient.post<boolean>(this.resetUrl, body, { headers });
      }
  
      validateOldPassword( oldPassword: string): Observable<any> {
        const userId = localStorage.getItem('userId');
        const params = new HttpParams()
          .set('userId', userId)           // Pass userId as query parameter
          .set('oldPassword', oldPassword); // Pass oldPassword as query parameter
    
        return this.httpClient.post<any>(this.oldUrl, null, { params });
      
}}
