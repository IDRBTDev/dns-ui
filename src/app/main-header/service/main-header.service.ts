import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "src/app/model/user.model";

@Injectable({
    providedIn:'root'
})

export class MainHeaderService{
    private userDetailsUrl = 'http://localhost:9002/dr/user/get';
    private uploadProfilePictureUrl = 'http://localhost:9002/dr/user/upload-profile-picture';
    private deleteProfilePictureUrl = 'http://localhost:9002/dr/user/deleteprofilepicture';

    constructor(private httpClient: HttpClient){}

    getUserDetailsById(userId: string): Observable<User> {
        return this.httpClient.get<User>(`${this.userDetailsUrl}/${userId}`);
    }

    uploadProfilePicture(userId: string, formData: FormData): Observable<Blob> {
        return this.httpClient.post(`${this.uploadProfilePictureUrl}/${userId}`, formData, {
            responseType: 'blob' 
        });
    }

    deleteProfilePicture(userId: string): Observable<void> {
        return this.httpClient.delete<void>(`${this.deleteProfilePictureUrl}/${userId}`);
    }

    

}