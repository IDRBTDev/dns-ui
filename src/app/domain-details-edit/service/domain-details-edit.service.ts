import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NameServerService {
  private nameserverurl = environment.apiURL+'/dr/nameServer/update'; 

  constructor(private http: HttpClient) { }

  // Method to update the name server details
  updateNameServer(nameServerId: number, nameServerDetails: any): Observable<any> {
    return this.http.put(`${this.nameserverurl}/${nameServerId}`, nameServerDetails);
  }

  
}
