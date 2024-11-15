import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn : 'root'
})
export class LoginService{

    private drloginUrl = 'http://localhost:9002/dr/users/login'

    constructor(private httpClient: HttpClient){

    }

    userLoginToDR(user: any){
        return this.httpClient.post<void>(this.drloginUrl,user,{observe: 'response'})
    }

}