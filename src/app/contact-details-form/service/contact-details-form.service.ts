import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.post(this.adminApiUrl, adminData);
  }

  // Save Technical Contact Details
  saveTechDetails(techData: any): Observable<any> {
    return this.http.post(this.techApiUrl, techData);
  }

  // Save Billing Contact Details
  saveBillDetails(billData: any): Observable<any> {
    return this.http.post(this.billApiUrl, billData);
  }

  // Save Admin Contact Details
  updateAdminDetails(adminData: any): Observable<any> {
    console.log('Sending Admin Details:', adminData);
    return this.http.put(this.adminApiUrl+"/update", adminData, {observe:'response'});
  }

  // Save Technical Contact Details
  updateTechDetails(techData: any): Observable<any> {
    return this.http.put(this.techApiUrl+"/update", techData,{observe:'response'});
  }

  // Save Billing Contact Details
  updateBillDetails(billData: any): Observable<any> {
    return this.http.put(this.billApiUrl+"/update", billData,{observe:'response'});
  }

  getContactOfficersDetails(organisationId: number){
    const apiUrl = 'http://localhost:9002/dr/administrativeContact/contactDetails?organisationId='+organisationId;
    return this.http.get<any[]>(apiUrl,{observe:'response'});
  }

  getAdminOfficerDetailsById(id: number){
    console.log(id);
    const apiUrl = this.adminApiUrl+'/getDetail/'+id;
    console.log(id);
    return this.http.get<any>(apiUrl, {observe: 'response'});
  }

  getTechnicalOfficerDetailsById(id: number){
    const apiUrl = this.techApiUrl+'/getDetail/'+id;
    return this.http.get<any>(apiUrl, {observe: 'response'});
  }

  getBillingOfficerDetailsById(id: number){
    const apiUrl = this.billApiUrl+'/getDetail/'+id;
    return this.http.get<any>(apiUrl, {observe: 'response'});
  }

}