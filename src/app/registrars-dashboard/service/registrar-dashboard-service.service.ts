import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrarDashboardServiceService {

  constructor(private http:HttpClient) { }

  fetchApplicationStatusforWeek(startDate,endDate,emailIds){
    const apiUrl = 'http://localhost:9002/dr/organisationDetails/all';
    return this.http.get<any[]>(apiUrl, {observe:'response'});
  }

  fetchApplicationStatusforMonth(startDate,endDate,emailIds){
    const apiUrl = 'http://localhost:9002/dr/organisationDetails/all';
    return this.http.get<any[]>(apiUrl, {observe:'response'});
  }

  fetchApplicationStatusforyear(startDate,endDate,emailIds){
    const apiUrl = 'http://localhost:9002/dr/organisationDetails/all';
    return this.http.get<any[]>(apiUrl, {observe:'response'});
  }
}
