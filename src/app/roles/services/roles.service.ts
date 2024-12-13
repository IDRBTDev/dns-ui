import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Roles } from 'src/app/model/roles.model';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private apiGatewayUrl: string;
  private roleMicroservicePathUrl: string;

  constructor(private http: HttpClient){
      this.apiGatewayUrl = environment.apiURL;
      this.roleMicroservicePathUrl = 'dr/roles';
  }

    /**
     * 
     *
     * @returns 
     */
    getAllRoles(){
      console.log("service method caleed")
      return this.http.get<Roles[]>(`${this.apiGatewayUrl}/${this.roleMicroservicePathUrl}/all`,{observe:'response'});
  }
  createRole(role: any) {
    return this.http.post<Roles>(`${this.apiGatewayUrl}/${this.roleMicroservicePathUrl}/create`, role, { observe: 'response' });

  }

  updateRole(role: any) {
    return this.http.put<Roles>(`${this.apiGatewayUrl}/${this.roleMicroservicePathUrl}/update`, role, { observe: 'response' });

  }

  getRole(id: number) {
    return this.http.get<Roles>(`${this.apiGatewayUrl}/${this.roleMicroservicePathUrl}/${id}`, { observe: 'response' });

  }

  deleteSelectedRoles(id: number) {
    return this.http.delete<Roles>(`${this.apiGatewayUrl}/${this.roleMicroservicePathUrl}/${id}`, { observe: 'response' });

  }

}


