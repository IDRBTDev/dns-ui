import { Component, OnInit } from '@angular/core';
import { DomainService } from '../rgnt-domain/service/domain.service';
import { lastValueFrom } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NameServerService } from '../name-server-form/service/name-server.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-domain-details',
  templateUrl: './domain-details.component.html',
  styleUrls: ['./domain-details.component.css']
})
export class DomainDetailsComponent implements OnInit {

  constructor(private domainService: DomainService, 
    private router: Router, private activatedRouter: ActivatedRoute,
    private nameServerService: NameServerService,private toastr:ToastrService
  ){

  }

  domainId: number = 0;
  async ngOnInit(): Promise<void> {
    this.activatedRouter.queryParams.subscribe(param => {
      var domainId = param['domainId'];
      this.domainId = param['domainId'];
    })
    console.log(this.domainId)
    await this.getDomainById(this.domainId);
    await this.getNameServersByDomainId(this.domainId);
  }

  domainDetail : any;
  async getDomainById(domainId: number): Promise<any>{
    await lastValueFrom(this.domainService.getDomainByDomainId(domainId)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          this.domainDetail = response.body;
          console.log(this.domainDetail)
        }
      }, error => {
        if(error.status === HttpStatusCode.Unauthorized){
          this.navigateToSessionTimeout();
        }
      }
    )
    return this.domainDetail;
  }

  async getNameServersByDomainId(domainId: number){
    await lastValueFrom(this.nameServerService.getNameServersByDomainId(domainId)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          this.domainDetail.nameServers = response.body;
        }
      },error => {
        if(error.status === HttpStatusCode.Unauthorized){
          this.router.navigateByUrl('/session-timeout');
        }
      }
    )
  }

  navigateToSessionTimeout() {
    this.router.navigateByUrl('/session-timeout');
  }

  cancelDomain() {
    const role = localStorage.getItem('userRole');
  
    if (role === 'IDRBTADMIN') {
      this.router.navigateByUrl('/rgtr-domains');
    } else {
      this.router.navigateByUrl('/rgnt-domains');
    }
  }
  
    domainedit(){
  this.router.navigateByUrl('/DomainEditPage', { state: { domainDetail: this.domainDetail } });

    }

    addNameServers(domainId){
      const navigationExtras: NavigationExtras = {
        state: {
          organisationId: this.domainDetail.organisationId,
          domainId: domainId,
          applicationId: this.domainDetail.applicationId,
          nameServerLength:this.domainDetail.nameServers?this.domainDetail.nameServers.length:0
        }
      };
      
      this.router.navigate(['/name-server'], navigationExtras);
    }
  

  deleteNameServerById(nameServerId){
    
    let  confirmed = window.confirm('Are you sure, you really want to delete this name server record ?');
   
  if(confirmed){
    this.nameServerService.deleteNameServer(nameServerId).subscribe({
      next:(response)=>{
        this.toastr.success("Deleted successfully");
        this.getNameServersByDomainId(this.domainId);
      },error:(error)=>{
        console.log(error)
      }
    })
  }
    
  }
}
