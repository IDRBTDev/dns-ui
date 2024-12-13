import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrarDashboardServiceService {
 
  

  constructor(private http:HttpClient) { }

  getDomainCount(){
    const apiUrl = environment.apiURL+'/dr/domain/countOfDomain';
    return this.http.get<any[]>(apiUrl, {observe:'response'});
}
fetchDomainStatusforWeek(startdate: string, endDate: string) {
  const apiUrl = environment.apiURL+`/dr/domain/getWeekDataForDomain?startdate=${startdate}&endDate=${endDate}`;
  return this.http.get<number[]>(apiUrl, { observe: 'response' });
}

fetchDomainStatusforMonth(startdate: string, endDate: string) {
  const apiUrl = environment.apiURL+`/dr/domain/getMonthDataForDomain?startdate=${startdate}&endDate=${endDate}`;
  return this.http.get<number[]>(apiUrl, {observe:'response'});
}
fetchDomainStatusforYear(startdate: string, endDate: string) {
  const apiUrl = environment.apiURL+`/dr/domain/getYearDataForDomain?startdate=${startdate}&endDate=${endDate}`;
  return this.http.get<number[]>(apiUrl, {observe:'response'});
}

fetchApplicationStatusforWeek(startdate: string, endDate: string) {
  const apiUrl = environment.apiURL+`/dr/domain/getWeekDataForApplicationStatus?startdate=${startdate}&endDate=${endDate}`;
  return this.http.get<number[]>(apiUrl, { observe: 'response' });
}

fetchApplicationStatusforMonth(startdate: string, endDate: string) {
  const apiUrl = environment.apiURL+`/dr/domain/getMonthDataForApplicationStatus?startdate=${startdate}&endDate=${endDate}`;
  return this.http.get<number[]>(apiUrl, {observe:'response'});
}
fetchApplicationStatusforYear(startdate: string, endDate: string) {
  const apiUrl = environment.apiURL+`/dr/domain/getYearDataForApplicationStatus?startdate=${startdate}&endDate=${endDate}`;
  return this.http.get<number[]>(apiUrl, {observe:'response'});
}

}
