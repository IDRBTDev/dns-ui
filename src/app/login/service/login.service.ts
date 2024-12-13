import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/app/environments/environment";

@Injectable({
    providedIn : 'root'
})
export class LoginService{

    private drloginUrl = environment.apiURL+'/dr/users/login';
    private getOtpUrl = environment.apiURL+'/dr/user/get-otp';
    private verifyOtpUrl = environment.apiURL+'/dr/user/verify-otp';

    constructor(private httpClient: HttpClient){

    }

    /**
     * 
     * @param user 
     * @returns 
     */
    userLoginToDR(user: any){
        return this.httpClient.post<void>(this.drloginUrl,user,{observe: 'response'})
    }

    /**
     * 
     * @param userId 
     * @returns 
     */
    getOtpForLoginUserByUserId(userId: string){
        return this.httpClient.get<number>(this.getOtpUrl+"/"+userId,{observe: 'response'});
    }

    /**
     * 
     * @param userId 
     * @returns 
     */
    verifyOtpForLoginUserByUserId(userId: string, otp: number){
        return this.httpClient.get<boolean>(this.verifyOtpUrl+"/"+userId+"/"+otp,{observe: 'response'});
    }

}