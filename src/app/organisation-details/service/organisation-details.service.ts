import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root',
})

export class OrganisationDetailsService {
    constructor(private http: HttpClient) { }
    // Method to submit form data to the backend API
    saveOrganisationDetails(formData: any): Observable<any> {
        console.log('Sending form data:', formData);
        const apiUrl = 'http://localhost:9002/dr/organisationDetails';
        return this.http.post(apiUrl, formData);
    }

    updateOrganisationDetails(organisationdetails: any){
        const apiUrl = 'http://localhost:9002/dr/organisationDetails/update';
        return this.http.put(apiUrl,organisationdetails,{observe: 'response'});
    }

    getOrganisationDetailsByOrganisationId(organisationId: number){
        const apiUrl = 'http://localhost:9002/dr/organisationDetails/getDetailsById/'+organisationId;
        return this.http.get(apiUrl, {observe:'response'});
    }

}
