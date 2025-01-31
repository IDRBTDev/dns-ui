import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NameServerService {
  private nameServerUrl =  environment.apiURL+'/dr/nameServer';

  constructor(private http: HttpClient) {}

  getAllNameServers(): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(`${this.nameServerUrl}/all`, {
      observe: 'response', headers: new HttpHeaders({
                  'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
              })
    });
  }

  getNameServersByDomainId(domainId: number){
    return this.http.get<any[]>(`${this.nameServerUrl}/getDetails/${domainId}`
      ,{observe:'response', headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    })});
  }

  addNameServer(data: any): Observable<HttpResponse<any>> {
    console.log(data);
    return this.http.post<HttpResponse<any>>(`${this.nameServerUrl}`, data, {
      observe: 'response', headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    })
    });
  }

  updateNameServer(data: any): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(
      `${this.nameServerUrl}`,
      data,
      { observe: 'response', headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    }) }
    );
  }

  deleteNameServer(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(`${this.nameServerUrl}/${id}`, {
      observe: 'response',headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    })
    });
  }

  updateListNameServer(data: any): Observable<HttpResponse<any>> {
    return this.http.put<HttpResponse<any>>(
      `${this.nameServerUrl}/updateList`,
      data,
      { observe: 'response', headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    }) }
    );
  }
  
}
