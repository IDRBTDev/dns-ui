import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Domain } from "src/app/model/domain.model";


@Injectable({
    providedIn:'root'
})

export class DomainApplicationDetailsService{
    private domainsUrl = 'http://localhost:9002/dr/domain';
    private domainOrgUrl = 'http://localhost:9002/dr/organisationDetails';


    constructor(private httpClient: HttpClient){}

    getDomainApplicationDetailsById(domainId:number){
        console.log("application details in service",domainId)
        return this.httpClient.get<any[]>(`${this.domainsUrl}/getDetails/${domainId}`,{observe: 'response'});
    }

    getOrganizationByDomainId(domainId: number){
        return this.httpClient.get<any>(`${this.domainOrgUrl}/getDetails/${domainId}`, {observe:'response'})

}
updateDomain(domainId: number, domain: Domain) {
    console.log(domainId);
    console.log(domain)
    return this.httpClient.put<any>(`${this.domainsUrl}/updateDomain/${domainId}`, domain, {
        
        observe: 'response'
    });
}


}