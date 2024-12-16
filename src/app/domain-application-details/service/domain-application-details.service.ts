import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/app/environments/environment";
import { Domain } from "src/app/model/domain.model";


@Injectable({
    providedIn:'root'
})

export class DomainApplicationDetailsService{
    private domainsUrl = environment.apiURL+'/dr/domain';
    private domainOrgUrl = environment.apiURL+'/dr/organisationDetails';


    constructor(private httpClient: HttpClient){}

    getDomainApplicationDetailsById(domainId:number){
        console.log("application details in service",domainId)
        return this.httpClient.get<any[]>(`${this.domainsUrl}/getDetails/${domainId}`,{observe: 'response'});
    }

    getOrganizationByDomainId(organisationId: number){
        return this.httpClient.get<any>(`${this.domainOrgUrl}/getDetailsById/${organisationId}`, {observe:'response'})

}
updateDomain(domainId: number, domain: Domain) {
    console.log(domainId);
    console.log(domain)
    return this.httpClient.put<any>(`${this.domainsUrl}/updateDomain/${domainId}`, domain, {
        
        observe: 'response'
    });
}


}