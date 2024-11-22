import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class DomainService{

    private domainsUrl = 'http://localhost:9002/dr/domain';

    constructor(private httpClient: HttpClient){}

    getAllDomains(userId: string){
        return this.httpClient.get<any[]>(`${this.domainsUrl}/all?userId=${userId}`,{observe: 'response'});
    }

    getDomainByDomainId(domainId: number){
        return this.httpClient.get<any>(`${this.domainsUrl}/getDetails/${domainId}`, {observe:'response'})
    }

}