import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrarDashboardServiceService {
 
  

  constructor(private http:HttpClient) { }

  getDomainCount(){
    const apiUrl = environment.apiURL+'/dr/domain/countOfDomain';
    return this.http.get<any[]>(apiUrl, {observe:'response', headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            })});
}
fetchDomainStatusforWeek(startdate: string, endDate: string) {
  const apiUrl = environment.apiURL+`/dr/domain/getWeekDataForDomain?startdate=${startdate}&endDate=${endDate}`;
  return this.http.get<number[]>(apiUrl, { observe: 'response', headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
}) });
}

fetchDomainStatusforMonth(startdate: string, endDate: string) {
  const apiUrl = environment.apiURL+`/dr/domain/getMonthDataForDomain?startdate=${startdate}&endDate=${endDate}`;
  return this.http.get<number[]>(apiUrl, {observe:'response' , headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
})});
}
fetchDomainStatusforYear(startdate: string, endDate: string) {
  const apiUrl = environment.apiURL+`/dr/domain/getYearDataForDomain?startdate=${startdate}&endDate=${endDate}`;
  return this.http.get<number[]>(apiUrl, {observe:'response', headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
})});
}

fetchApplicationStatusforWeek(startdate: string, endDate: string) {
  const apiUrl = environment.apiURL+`/dr/domain/getWeekDataForApplicationStatus?startdate=${startdate}&endDate=${endDate}`;
  return this.http.get<number[]>(apiUrl, { observe: 'response' , headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
})});
}

fetchApplicationStatusforMonth(startdate: string, endDate: string) {
  const apiUrl = environment.apiURL+`/dr/domain/getMonthDataForApplicationStatus?startdate=${startdate}&endDate=${endDate}`;
  return this.http.get<number[]>(apiUrl, {observe:'response', headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
})});
}
fetchApplicationStatusforYear(startdate: string, endDate: string) {
  const apiUrl = environment.apiURL+`/dr/domain/getYearDataForApplicationStatus?startdate=${startdate}&endDate=${endDate}`;
  return this.http.get<number[]>(apiUrl, {observe:'response', headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
})});
}

}
