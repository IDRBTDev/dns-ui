import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { filter, Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class DomainService{

    private domainsUrl = 'http://localhost:9002/dr/domain';

    constructor(private httpClient: HttpClient){}

    getAllDomains(userId: string){
        return this.httpClient.get<any[]>(`${this.domainsUrl}/all?userId=${userId}`,{observe: 'response'});
    }

    getFilteredData(filters: any) {
        let params = new HttpParams();
      
        // Add filters to params if they are provided

        if (filters.userId) params = params.set('userId', filters.userId);
        if (filters.organisationName) params = params.set('organisationName', filters.organisationName);
        if (filters.nsRecordStatus) params = params.set('nsRecordStatus', filters.nsRecordStatus);
        if (filters.status) params = params.set('status', filters.status);
        console.log("status in servie:",filters.status);
        if (filters.fromDate) params = params.set('fromDate', filters.fromDate); 
        if (filters.toDate) params = params.set('toDate', filters.toDate); 
        
        // Log the filters to ensure they are correct
        console.log('Sending filters:', filters);
        
        // Make the GET request with the query parameters
        return this.httpClient.get<any[]>(`${this.domainsUrl}/all/filter`, { params: params, observe: 'response' });
    }
    

    getDomainByDomainId(domainId: number){
        return this.httpClient.get<any>(`${this.domainsUrl}/getDetails/${domainId}`, {observe:'response'})
    }

    updateDomainDetails(domain: any){
        return this.httpClient.put<any>(`${this.domainsUrl}/updateDomain/${domain.domainId}`,domain,{observe: 'response'});
    }

}