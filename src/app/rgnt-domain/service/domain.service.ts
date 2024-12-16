import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { filter, Observable } from "rxjs";
import { environment } from "src/app/environments/environment";

@Injectable({
    providedIn:'root'
})
export class DomainService{

    private domainsUrl = environment.apiURL+'/dr/domain';

    constructor(private httpClient: HttpClient){}

    getAllDomains(userId: string){
        return this.httpClient.get<any[]>(`${this.domainsUrl}/all?userId=${userId}`,{observe: 'response'});
    }

    getAllDomainsByOrgId(orgId: number){
        console.log(orgId)
        return this.httpClient.get<any[]>(`${this.domainsUrl}/get/all?organisationId=${orgId}`,{observe: 'response'});
    }

    getFilteredData(filters: any) {
        let params = new HttpParams();
    
        // Add filters to params if they are provided
        if (filters.userId) params = params.set('userId', filters.userId);
        if (filters.organisationName) params = params.set('organisationName', filters.organisationName);
        if (filters.nsRecordStatus) params = params.set('nsRecordStatus', filters.nsRecordStatus);
        if (filters.status) params = params.set('status', filters.status);
    
        // Log the filters to ensure they are correct
        console.log('Sending filters:', filters);
        
        // Format the dates before adding them to params
        if (filters.submissionDateFrom) {
            const formattedFromDate = this.formatDate(filters.submissionDateFrom);
            params = params.set('submissionDateFrom', formattedFromDate);
        }
        if (filters.submissionDateTo) {
            const formattedToDate = this.formatDate(filters.submissionDateTo);
            params = params.set('submissionDateTo', formattedToDate);
        }
        
        // Make the GET request with the query parameters
        return this.httpClient.get<any[]>(`${this.domainsUrl}/all/filter`, { params: params, observe: 'response' });
    }
    
    // Helper method to format dates in ISO 8601 format
    formatDate(date: string): string {
        if (!date) return '';
        const parsedDate = new Date(date);
        return parsedDate.toISOString();  // Convert date to ISO 8601 string
    }
    
    

    getDomainByDomainId(domainId: number){
        return this.httpClient.get<any>(`${this.domainsUrl}/getDetails/${domainId}`, {observe:'response'})
    }

    updateDomainDetails(domain: any){
        return this.httpClient.put<any>(`${this.domainsUrl}/updateDomain/${domain.domainId}`,domain,{observe: 'response'});
    }

    getAllApplicationInQueue(){
        return this.httpClient.get<any[]>(`${this.domainsUrl}/applicationInQueue`,{observe: 'response'});
    }
    uploadPaymentReceipt(formData: FormData): Observable<any> {
        return this.httpClient.post(`${this.domainsUrl}/uploadPaymentReceipt`, formData,{ responseType: 'text'});
      }

}