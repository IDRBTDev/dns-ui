import { Component } from '@angular/core';
import { DomainService } from '../domain/service/domain.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpStatusCode } from '@angular/common/http';
import { DomainApplicationDetailsService } from './service/domain-application-details.service';

@Component({
  selector: 'app-domain-application-details',
  templateUrl: './domain-application-details.component.html',
  styleUrls: ['./domain-application-details.component.css']
})
export class DomainApplicationDetailsComponent {

  constructor(private route: ActivatedRoute,
    private domainService: DomainService, private oreganizationService:DomainApplicationDetailsService,
    private router: Router) {
    
  }
  domainId: number; 
  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(param => {
      var domainId = param['domainId'];
      this.domainId = param['domainId'];
    })
    console.log(this.domainId)
    await this.getDomainApplicationDetails(this.domainId);
    await this.getOrganizationDetails(this.domainId);
  }
  domainsList: any;
  getDomainApplicationDetails(domainId:number) {
   
    console.log("Datal",domainId)
    this.domainService.getDomainByDomainId(domainId).subscribe({
      next: (res) => {
        if (res.status === HttpStatusCode.Ok) {
          this.domainsList = res.body;
         console.log("Ticket data received:",res);
        } else {
          console.log("Unexpected status code:", res.status);
         
        }
      },
      error: (error) => {
        console.error("Error fetching ticket data:", error);
      }
    });
  }
  organizationsList: any;
  getOrganizationDetails(domainId:number) {
   
    console.log("Datal",domainId)
    this.oreganizationService.getOrganizationByDomainId(domainId).subscribe({
      next: (res) => {
        if (res.status === HttpStatusCode.Ok) {
          this.organizationsList = res.body;
         console.log("Ticket data received:",res);
        } else {
          console.log("Unexpected status code:", res.status);
         
        }
      },
      error: (error) => {
        console.error("Error fetching ticket data:", error);
      }
    });
  }
}
