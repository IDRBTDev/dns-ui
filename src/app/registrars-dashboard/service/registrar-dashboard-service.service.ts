import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrarDashboardServiceService {
 
  

  constructor(private http:HttpClient) { }

  getDomainCount(){
    const apiUrl = 'http://localhost:9002/dr/domain/countOfDomain';
    return this.http.get<any[]>(apiUrl, {observe:'response'});
}
fetchDomainStatusforWeek(startdate: string, endDate: string) {
  const apiUrl = `http://localhost:9002/dr/domain/getWeekDataForDomain?startdate=${startdate}&endDate=${endDate}`;
  return this.http.get<number[]>(apiUrl, { observe: 'response' });
}

fetchDomainStatusforMonth(startdate: string, endDate: string) {
  const apiUrl = `http://localhost:9002/dr/domain/getMonthDataForDomain?startdate=${startdate}&endDate=${endDate}`;
  return this.http.get<number[]>(apiUrl, {observe:'response'});
}
fetchDomainStatusforYear(startdate: string, endDate: string) {
  const apiUrl = `http://localhost:9002/dr/domain/getYearDataForDomain?startdate=${startdate}&endDate=${endDate}`;
  return this.http.get<number[]>(apiUrl, {observe:'response'});
}

fetchApplicationStatusforWeek(startdate: string, endDate: string) {
  const apiUrl = `http://localhost:9002/dr/domain/getWeekDataForApplicationStatus?startdate=${startdate}&endDate=${endDate}`;
  return this.http.get<number[]>(apiUrl, { observe: 'response' });
}

fetchApplicationStatusforMonth(startdate: string, endDate: string) {
  const apiUrl = `http://localhost:9002/dr/domain/getMonthDataForApplicationStatus?startdate=${startdate}&endDate=${endDate}`;
  return this.http.get<number[]>(apiUrl, {observe:'response'});
}
fetchApplicationStatusforYear(startdate: string, endDate: string) {
  const apiUrl = `http://localhost:9002/dr/domain/getYearDataForApplicationStatus?startdate=${startdate}&endDate=${endDate}`;
  return this.http.get<number[]>(apiUrl, {observe:'response'});
}

}
