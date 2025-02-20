import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';



@Injectable({
    providedIn: 'root',
})

export class OrganisationDetailsService {
   
    constructor(private http: HttpClient) { }
    // Method to submit form data to the backend API
    saveOrganisationDetails(formData: any): Observable<any> {
        console.log('Sending form data:', formData);
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
          });
        const apiUrl =  environment.apiURL+'/dr/organisationDetails';
        return this.http.post(apiUrl, formData,{headers});
    }

    updateOrganisationDetails(organisationdetails: any){
        const apiUrl = environment.apiURL+'/dr/organisationDetails/update';
        return this.http.put(apiUrl,organisationdetails,{observe: 'response', headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        })});
    }

    getOrganisationDetailsByOrganisationId(organisationId: number){
        const apiUrl = environment.apiURL+'/dr/organisationDetails/getDetailsById/'+organisationId;
        return this.http.get(apiUrl, {observe:'response', headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        })});
    }

    getAllOrganisations(){
        const apiUrl = environment.apiURL+'/dr/organisationDetails/all';
        return this.http.get<any[]>(apiUrl, {observe:'response', headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        })});
    }

    getAllStdCodes(){
      const apiUrl = environment.apiURL+'/dr/organisationDetails/getAllStdCodes';
      return this.http.get<any[]>(apiUrl, {observe:'response', headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
      })});
  }

    sendOtpForVerifyingOfficers(role: string, email: string) {
        let apiUrl;
        if(role=="Administrative Officer"){
            apiUrl=environment.apiURL + '/dr/administrativeContact/sendOtpForVerifyOfficer';
        }else if(role=="Technical Officer"){
            apiUrl=environment.apiURL + '/dr/technicalContact/sendOtpForVerifyOfficer';
        }else if(role=="Billing Officer"){
            apiUrl=environment.apiURL + '/dr/billingContact/sendOtpForVerifyOfficer';
        }
       

    
        const params = {
          RoleName: role,
          email: email
        };
    
        return this.http.get<Boolean>(apiUrl, {
          observe: 'response',
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
          }),
          params: params // Add the parameters to the request
        });
      }
      verifyOtpForEmailVerification(email: string, otp,role:string) {
        let apiUrl;
        if(role=="Administrative Officer"){
            apiUrl=environment.apiURL + '/dr/administrativeContact/VerifyEmailForOfficer';
        }else if(role=="Technical Officer"){
            apiUrl=environment.apiURL + '/dr/technicalContact/VerifyEmailForOfficer';
        }else if(role=="Billing Officer"){
            apiUrl=environment.apiURL + '/dr/billingContact/VerifyEmailForOfficer';
        }
       

    
        const params = {
          RoleName: role,
          email: email,
          Otp:otp
        };
    
     return this.http.get<any>(apiUrl, {
          observe: 'response',
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
          }),
          params: params // Add the parameters to the request
        });
      }

    }

    
