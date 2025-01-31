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
        const apiUrl =  environment.apiURL+'/dr/organisationDetails';
        return this.http.post(apiUrl, formData);
    }

    updateOrganisationDetails(organisationdetails: any){
        const apiUrl = environment.apiURL+'/dr/organisationDetails/update';
        return this.http.put(apiUrl,organisationdetails,{observe: 'response'});
    }

    getOrganisationDetailsByOrganisationId(organisationId: number){
        const apiUrl = environment.apiURL+'/dr/organisationDetails/getDetailsById/'+organisationId;
        return this.http.get(apiUrl, {observe:'response'});
    }

    getAllOrganisations(){
        const apiUrl = environment.apiURL+'/dr/organisationDetails/all';
        return this.http.get<any[]>(apiUrl, {observe:'response', headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        })});
    }

}
