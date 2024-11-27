import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn : 'root'
})
export class UserService{

    private drRegUrl = 'http://localhost:9002/dr/user/save';
    private getAllUsersUrl = 'http://localhost:9002/dr/user/all';
    private getUserUrl = 'http://localhost:9002/dr/user/getDetails';
    private updateUserUrl = 'http://localhost:9002/dr/user/update';
    private deleteUserUrl = 'http://localhost:9002/dr/user/delete';
    private getUserByEmailUrl = 'http://localhost:9002/dr/user/get';

    constructor(private httpClient: HttpClient){

    }

    getAllUsers(organisationId: number){
        return this.httpClient.get<any[]>(this.getAllUsersUrl+"?organisationId="+organisationId,{observe:'response'});
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

}