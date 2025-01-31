import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
//import { environment } from 'src/app/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ContactDetailsFormService {
  // Replace these URLs with your actual API endpoints
  // private adminApiUrl = 'http://localhost:9010/dr/adminContact';
  // private techApiUrl = 'http://localhost:9010/dr/techContact';
  // private billApiUrl = 'http://localhost:9010/dr//billContact';

  private adminApiUrl = environment.apiURL+'/dr/administrativeContact';



  private techApiUrl = environment.apiURL+'/dr/technicalContact';



  private billApiUrl = environment.apiURL+'/dr/billingContact';


  constructor(private http: HttpClient) {}

  // Save Admin Contact Details
  saveAdminDetails(adminData: any): Observable<any> {
    console.log('Sending Admin Details:', adminData);
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    });
    return this.http.post(this.adminApiUrl, adminData,{headers});
  }

  // Save Technical Contact Details
  saveTechDetails(techData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    });
    return this.http.post(this.techApiUrl, techData,{headers});
  }

  // Save Billing Contact Details
  saveBillDetails(billData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    });
    return this.http.post(this.billApiUrl, billData,{headers});
  }

  // Save Admin Contact Details
  updateAdminDetails(adminData: any): Observable<any> {
    console.log('Sending Admin Details:', adminData);
    return this.http.put(this.adminApiUrl+"/update", adminData, {observe:'response', headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
  })});
  }

  // Save Technical Contact Details
  updateTechDetails(techData: any): Observable<any> {
    return this.http.put(this.techApiUrl+"/update", techData,{observe:'response', headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
  })});
  }

  // Save Billing Contact Details
  updateBillDetails(billData: any): Observable<any> {
    return this.http.put(this.billApiUrl+"/update", billData,{observe:'response', headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
  })});
  }

  getContactOfficersDetails(organisationId: number){
    const apiUrl = 'http://localhost:9002/dr/administrativeContact/contactDetails?organisationId='+organisationId;
    return this.http.get<any[]>(apiUrl,{observe:'response', headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
  })});
  }

  getAdminOfficerDetailsById(id: number){
    console.log(id);
    const apiUrl = this.adminApiUrl+'/getDetail/'+id;
    console.log(id);
    return this.http.get<any>(apiUrl, {observe: 'response', headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
  })});
  }

  getTechnicalOfficerDetailsById(id: number){
    const apiUrl = this.techApiUrl+'/getDetail/'+id;
    return this.http.get<any>(apiUrl, {observe: 'response', headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
  })});
  }

  getBillingOfficerDetailsById(id: number){
    const apiUrl = this.billApiUrl+'/getDetail/'+id;
    return this.http.get<any>(apiUrl, {observe: 'response', headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
  })});
  }

}