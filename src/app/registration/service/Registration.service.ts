import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/app/environments/environment";

@Injectable({
    providedIn : 'root'
})
export class RegistrationService{

    private drRegUrl = environment.apiURL+'/dr/user/save';
    private verifyOtpUrl = environment.apiURL+'/dr/user/verify-otp'; 
    private userRegUrl = environment.apiURL+'/dr/registerDetail';
    private getRegUserUrl = environment.apiURL+'/dr/registerDetail/get';

    constructor(private httpClient: HttpClient){

    }

    userRegistationToDR(user: any){
        return this.httpClient.post<void>(this.drRegUrl,user,{observe: 'response'})
    }
    verifyOtp(regUser: any){
        //return this.httpClient.get<boolean>(this.verifyOtpUrl+"/"+userId+"/"+otp,{observe:'response'});
        return this.httpClient.get<boolean>(`${this.getRegUserUrl}/${regUser.registrationUserId}/${regUser.registrationOtp}`,{observe:'response'});
      }

    saveRegUser(regUser: any){
        const regFrom = 'REGISTRATION-FORM';
        return this.httpClient.post<boolean>(this.userRegUrl+"?regFrom="+regFrom, regUser, {observe: 'response'});
    }
}