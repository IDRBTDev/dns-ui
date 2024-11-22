import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({
    providedIn:'root'
})

export class DomainApplicationDetailsService{
    private domainsUrl = 'http://localhost:9008/dr/domain';
    private domainOrgUrl = 'http://localhost:9002/dr/organisationDetails';


    constructor(private httpClient: HttpClient){}

    getDomainApplicationDetailsById(domainId:number){
        console.log("application details in service",domainId)
        return this.httpClient.get<any[]>(`${this.domainsUrl}/getDetails/${domainId}`,{observe: 'response'});
    }

    getOrganizationByDomainId(domainId: number){
        return this.httpClient.get<any>(`${this.domainOrgUrl}/getDetails/${domainId}`, {observe:'response'})

}

}