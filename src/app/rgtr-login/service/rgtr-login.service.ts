import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RgtrLoginService {

     
      private getRegistrarOtpUrl = environment.apiURL+'/dr/rgtrUser/get-otp';
      private verifyRegistrarOtpUrl=environment.apiURL+'/dr/rgtrUser/verify-otp';
      private rgtrDrloginUrl = environment.apiURL+'/dr/rgtrusers/login';
      private verifyemailUrl = environment.apiURL+'/dr/rgtrUser/verify-user';
      constructor(private httpClient: HttpClient){
  
      }


       verifyUserEmail(userId: string): Observable<string[]> {
          return this.httpClient.get<any>(`${this.verifyemailUrl}/${userId}`);
       }
       getOtpForRgtrLoginUserByUserId(userId: string){
        return this.httpClient.get<number>(this.getRegistrarOtpUrl+"/"+userId,{observe: 'response'});
    }
    verifyRegistrarOtpForLoginUserByUserId(userId: string, otp: number){
        return this.httpClient.get<boolean>(this.verifyRegistrarOtpUrl+"/"+userId+"/"+otp,{observe: 'response'});
    }
    rgtruserLoginToDR(user: any){
        return this.httpClient.post<void>(this.rgtrDrloginUrl,user,{observe: 'response'})
    }
        
}
