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
    private domainService: DomainApplicationDetailsService, 
    private router: Router) {
    
  }
  domainId: number; 
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.domainId = +params['domainId'];  
      this.getDomainApplicationDetails(this.domainId);
    });
  }
  domainsList: any;
  getDomainApplicationDetails(domainId:number) {
   
    console.log("Datal",domainId)
    this.domainService.getDomainApplicationDetailsById(domainId).subscribe({
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
}
