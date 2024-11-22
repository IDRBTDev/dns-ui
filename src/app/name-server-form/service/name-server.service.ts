import { 
  Injectable } from 
  '@angular/core';
  
  import { 
  HttpClient, HttpResponse } 
  from '@angular/common/http';
  
  import { 
  Observable } from 
  'rxjs';
  
  
  
  @Injectable({
  
    providedIn:
  'root'
  
  })
  
  export class
  NameServerService {
  
  
  
    private 
  nameServerUrl = 
  'http://localhost:9009/dr/nameServer';
  
  
  
    constructor(private http: 
  HttpClient) { }
  
  
  
    getAllNameServers():
  Observable<HttpResponse<any[]>> {
  
      return this.http.get<any[]>(`${this.nameServerUrl}/all`, { observe: 'response' });
  
    }
  
  
  
    addNameServer(data:
  any): 
  Observable<HttpResponse<any>> {
  
      return this.http.post<HttpResponse<any>>(`${this.nameServerUrl}`,data, { observe: 'response' });
  
    }
  
  
  
    updateNameServer(id:
  number, data:
  any): 
  Observable<HttpResponse<any>> {
  
      return this.http.put<HttpResponse<any>>(`${this.nameServerUrl}/${id}`,data, { observe:'response' });
  
    }
  
  
  
    deleteNameServer(id:
  number):
  Observable<HttpResponse<any>> {
  
      return this.http.delete<HttpResponse<any>>(`${this.nameServerUrl}/${id}`,
   { observe:'response' });
  
    }
  
  }