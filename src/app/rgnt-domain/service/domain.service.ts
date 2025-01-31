import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { filter, Observable } from "rxjs";
import { environment } from "src/app/environments/environment";

@Injectable({
    providedIn:'root'
})
export class DomainService{

    private domainsUrl = environment.apiURL+'/dr/domain';
    private priceDetailsUrl=environment.apiURL+'/dr/priceDetails';

    constructor(private httpClient: HttpClient){}

    getAllDomains(userId: string){
        return this.httpClient.get<any[]>(`${this.domainsUrl}/all?userId=${userId}`,{observe: 'response', headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        })});
    }

    getAllDomainsByOrgId(orgId: number){
        console.log(orgId)
        console.log("jwtToken",localStorage.getItem('jwtToken'))
        return this.httpClient.get<any[]>(`${this.domainsUrl}/get/all?organisationId=${orgId}`,{observe: 'response', headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        }
        )});
    }

    getFilteredData(filters: any) {
        let params = new HttpParams();
    
        // Add filters to params if they are provided
        if (filters.applicationId) params = params.set('applicationId', filters.applicationId);
        if (filters.userId) params = params.set('userId', filters.userId);
        if (filters.organisationName) params = params.set('organisationName', filters.organisationName);
        if (filters.domainName) params = params.set('domainName',filters.domainName);
        if (filters.nsRecordStatus) params = params.set('nsRecordStatus', filters.nsRecordStatus);
        if (filters.status) params = params.set('status', filters.status);
    
        // Log the filters to ensure they are correct
        console.log('Sending filters:', filters);
        
        // Format the dates before adding them to params
        if (filters.submissionDateFrom) {
            // const formattedFromDate = this.formatDate(filters.submissionDateFrom);
            params = params.set('submissionDateFrom', filters.submissionDateFrom);
        }
        if (filters.submissionDateTo) {
            // const formattedToDate = this.formatDate(filters.submissionDateTo);
            params = params.set('submissionDateTo', filters.submissionDateTo);
        }
        
        // Make the GET request with the query parameters
        return this.httpClient.get<any[]>(`${this.domainsUrl}/all/filter`, { params: params, observe: 'response',headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        }) });
    }
    
    // Helper method to format dates in ISO 8601 format
    formatDate(date: string): string {
        if (!date) return '';
        const parsedDate = new Date(date);
        return parsedDate.toISOString();  // Convert date to ISO 8601 string
    }
    
    

    getDomainByDomainId(domainId: number){
        return this.httpClient.get<any>(`${this.domainsUrl}/getDetails/${domainId}`, {observe:'response',headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        })})
    }

    updateDomainDetails(domain: any){
        return this.httpClient.put<any>(`${this.domainsUrl}/updateDomain/${domain.domainId}`,domain,{observe: 'response',headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        })});
    }

    getAllApplicationInQueue(){
        return this.httpClient.get<any[]>(`${this.domainsUrl}/applicationInQueue`,{observe: 'response',headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        })});
    }
    uploadPaymentReceipt(formData: FormData): Observable<any> {
        return this.httpClient.post(`${this.domainsUrl}/uploadPaymentReceipt`, formData,{ responseType: 'text',headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        })});
      }
      updatePaymentReceipt(domainId: number, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('domainId', domainId.toString());
    
        // Perform the PUT request and expect JSON response
        return this.httpClient.put(`${this.domainsUrl}/updatePaymentReceipt/${domainId}`, formData,{headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        })});
    }
    getAllPriceDetails(){
        return this.httpClient.get<any[]>(`${this.priceDetailsUrl}/getAll`,{observe: 'response',headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        })});
    }
   
   
}