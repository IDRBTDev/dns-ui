import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { RgtrRoles } from 'src/app/model/rgtrRole.model';

@Injectable({
  providedIn: 'root'
})
export class RgtrRoleService {
private apiGatewayUrl: string;
  private roleMicroservicePathUrl: string;

  constructor(private http: HttpClient){
      this.apiGatewayUrl = environment.apiURL;
      this.roleMicroservicePathUrl = 'dr/rgtrRoles';
  }

    /**
     * 
     *
     * @returns 
     */
    getAllRoles(){
      console.log("service method caleed")
      return this.http.get<RgtrRoles[]>(`${this.apiGatewayUrl}/${this.roleMicroservicePathUrl}/all`,{observe:'response'});
  }
  createRole(role: any) {
    return this.http.post<RgtrRoles>(`${this.apiGatewayUrl}/${this.roleMicroservicePathUrl}/create`, role, { observe: 'response' });

  }

  updateRole(role: any) {
    return this.http.put<RgtrRoles>(`${this.apiGatewayUrl}/${this.roleMicroservicePathUrl}/update`, role, { observe: 'response' });

  }

  getRole(id: number) {
    return this.http.get<RgtrRoles>(`${this.apiGatewayUrl}/${this.roleMicroservicePathUrl}/${id}`, { observe: 'response' });

  }

  deleteSelectedRoles(id: number) {
    return this.http.delete<RgtrRoles>(`${this.apiGatewayUrl}/${this.roleMicroservicePathUrl}/${id}`, { observe: 'response' });

  }

}
