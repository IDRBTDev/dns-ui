import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RgtrUserService {


  private updateUserUrl = environment.apiURL+'/dr/rgtrUser/update';
  private deleteUserUrl = environment.apiURL+'/dr/rgtrUser/delete';
  constructor(private httpClient: HttpClient) { }


  updateUser(user: any){
    return this.httpClient.put<any>(this.updateUserUrl, user, {observe: 'response'});
}

deleteUserByUserId(email){
  return this.httpClient.delete<boolean>(this.deleteUserUrl+"/"+email, {observe: 'response'});
}
}
