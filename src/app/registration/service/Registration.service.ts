import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn : 'root'
})
export class RegistrationService{

    private drRegUrl = 'http://localhost:9002/dr/user/save';
    private verifyOtpUrl = 'http://localhost:9002/dr/user/verify-otp'; 

    constructor(private httpClient: HttpClient){

    }

    userRegistationToDR(user: any){
        return this.httpClient.post<void>(this.drRegUrl,user,{observe: 'response'})
    }
    verifyOtp(userId: string, otp: number){
        
        //return this.httpClient.get<boolean>(this.verifyOtpUrl+"/"+userId+"/"+otp,{observe:'response'});
        return this.httpClient.get<boolean>(`${this.verifyOtpUrl}/${userId}/${otp}`,{observe:'response'});
      }
}