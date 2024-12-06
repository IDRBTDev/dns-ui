import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NameServerService {
  private nameServerUrl = 'http://localhost:9002/dr/nameServer';

  constructor(private http: HttpClient) {}

  getAllNameServers(): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(`${this.nameServerUrl}/all`, {
      observe: 'response',
    });
  }

  getNameServersByDomainId(domainId: number){
    return this.http.get<any[]>(`${this.nameServerUrl}/getDetails/${domainId}`
      ,{observe:'response'});
  }

  addNameServer(data: any): Observable<HttpResponse<any>> {
    console.log(data);
    return this.http.post<HttpResponse<any>>(`${this.nameServerUrl}`, data, {
      observe: 'response',
    });
  }

  updateNameServer(data: any): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(
      `${this.nameServerUrl}`,
      data,
      { observe: 'response' }
    );
  }

  deleteNameServer(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(`${this.nameServerUrl}/${id}`, {
      observe: 'response',
    });
  }
  
}
