import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "src/app/model/user.model";

@Injectable({
    providedIn:'root'
})

export class MainHeaderService{
    private userDetailsUrl = 'http://localhost:9002/dr/user/get';

    constructor(private httpClient: HttpClient){}

    // Method to fetch user details based on userId (now a string)
    getUserDetailsById(userId: string): Observable<User> {
        return this.httpClient.get<User>(`${this.userDetailsUrl}/${userId}`);
    }

}