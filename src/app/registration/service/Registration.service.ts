import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/app/environments/environment";

@Injectable({
    providedIn : 'root'
})
export class RegistrationService{

    private drRegUrl = environment.apiURL+'/dr/user/save';
    private verifyOtpUrl = environment.apiURL+'/dr/user/verify-otp'; 
    private userRegUrl = environment.apiURL+'/dr/registerDetail';
    private getRegUserUrl = environment.apiURL+'/dr/registerDetail/get';
    private getRegUserUrl1 = environment.apiURL+'/dr/user';
  private getRegUserOtpUrl = environment.apiURL+'/dr/registerDetail';
    constructor(private httpClient: HttpClient){

    }

    userRegistationToDR(user: any){
        return this.httpClient.post<void>(this.drRegUrl,user,{observe: 'response'})
    }
    verifyOtp(registrationUserId: string, otp: number): Observable<any> {
        return this.httpClient.get<any>(`${this.getRegUserOtpUrl}/get/${registrationUserId}/${otp}`);
      }
      

    saveRegUser(regUser: any){
        const regFrom = 'REGISTRATION-FORM';
        return this.httpClient.post<boolean>(this.userRegUrl+"?regFrom="+regFrom, regUser, {observe: 'response'});
    }
    resendOtp(registrationUserId: string): Observable<any> {
        return this.httpClient.get<any>(`${this.getRegUserOtpUrl}/resend/${registrationUserId}`);
      }

      checkUserExists(userId: string): Observable<any> {
        return this.httpClient.get<any>(`${this.getRegUserUrl1}/get/${userId}`);
      }
      checkRegisterUserExists(registrationUserId: string): Observable<any> {
        console.log(registrationUserId);
        return this.httpClient.get<any>(`${this.getRegUserOtpUrl}/get/${registrationUserId}`);
      }
}