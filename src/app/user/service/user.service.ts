import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/app/environments/environment";

@Injectable({
    providedIn : 'root'
})
export class UserService{

    private drRegUrl = environment.apiURL+'/dr/user/save';
    private getAllUsersUrl = environment.apiURL+'/dr/user/all';
    private getUserUrl = environment.apiURL+'/dr/user/getDetails';
    private updateUserUrl = environment.apiURL+'/dr/user/update';
    private deleteUserUrl = environment.apiURL+'/dr/user/delete';
    private getUserByEmailUrl = environment.apiURL+'/dr/user/get';
    
    constructor(private httpClient: HttpClient){

    }

    getAllUsers(organisationId: number){
        const url = `${this.getAllUsersUrl}?organisationId=${organisationId}`;
        console.log('API URL:', url); 
        return this.httpClient.get<any[]>(url, { observe: 'response' });
    }

    saveUser(user: any){
        return this.httpClient.post<void>(this.drRegUrl,user,{observe: 'response'});
    }

    getUserById(id: number){
        return this.httpClient.get<any>(this.getUserUrl+"/"+id,{observe:'response'})
    }

    updateUser(user: any){
        return this.httpClient.put<any>(this.updateUserUrl, user, {observe: 'response'});
    }

    deleteUserById(id: number){
        return this.httpClient.delete<void>(this.deleteUserUrl+"/"+id, {observe: 'response'});
    }

    getUserByEmailId(userId: string){
        return this.httpClient.get<any>(this.getUserByEmailUrl+"/"+userId, {observe: 'response'});
    }
    getAllActiveUsers(){
        const url = environment.apiURL+"/dr/user";
        console.log('API URL:', url); 
        return this.httpClient.get<number>(url+"/"+"activeUser", { observe: 'response' });
    }

}