import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomainService } from '../domain/service/domain.service';
import { HttpStatusCode } from '@angular/common/http';
import { lastValueFrom, window } from 'rxjs';
import { NameServerService } from './service/domain-details-edit.service';

@Component({
  selector: 'app-domain-details-edit',
  templateUrl: './domain-details-edit.component.html',
  styleUrls: ['./domain-details-edit.component.css']
})
export class DomainDetailsEditComponent implements OnInit {
  constructor(private domainService: DomainService, 
    private router: Router, private activatedRouter: ActivatedRoute,  private nameServerService: NameServerService
  ){
   const state = history.state.domainDetail;
   if (state) {
    // Use the data passed through router state
    this.domainDetail = state;
  } else {
    // If not, fetch the data from the API
    this.activatedRouter.queryParams.subscribe(param => {
      this.domainId = param['domainId'];
      this.getDomainById(this.domainId);
    });
  }

  }

  domainId: number = 0;
  async ngOnInit(): Promise<void> {
    this.activatedRouter.queryParams.subscribe(param => {
      var domainId = param['domainId'];
      this.domainId = param['domainId'];
    })
    console.log(this.domainId)
    await this.getDomainById(this.domainId);
  }

  domainDetail : any;
  async getDomainById(domainId: number): Promise<any>{
    await lastValueFrom(this.domainService.getDomainByDomainId(domainId)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          this.domainDetail = response.body;
        }
      }, error => {
        if(error.status === HttpStatusCode.Unauthorized){
          this.navigateToSessionTimeout();
        }
      }
    )
    return this.domainDetail;
  }

  navigateToSessionTimeout() {
    this.router.navigateByUrl('/session-timeout');
  }

  backDomain(){
    this.router.navigateByUrl('domain-details');
    // this.router.navigateByUrl(`/domain-details?domainId=${this.domainId}`);
    }
    crossButton(){
      console.log("cancel button is working good");
    }

     
  onSubmit(): void {
    this.domainDetail.nameServers.forEach(ns => {
      const nameServerId = ns.id; 
      this.nameServerService.updateNameServer(nameServerId, ns)
        .subscribe(
          response => {
            console.log('Name Server updated successfully', response);
            alert('Name Server updated successfully');
          },
          error => {
            console.error('Error updating Name Server', error);
            alert('Error updating Name Server');
          }
        );
    });
  }

    


  }
