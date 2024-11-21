import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({
    providedIn:'root'
})

export class DomainApplicationDetailsService{
    private domainsUrl = 'http://localhost:9008/dr/domain';


    constructor(private httpClient: HttpClient){}

    getDomainApplicationDetailsById(domainId:number){
        console.log("application details in service",domainId)
        return this.httpClient.get<any[]>(`${this.domainsUrl}/getDetails/${domainId}`,{observe: 'response'});
    }

}