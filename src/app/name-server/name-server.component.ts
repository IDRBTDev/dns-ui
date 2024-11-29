import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-name-server',
  templateUrl: './name-server.component.html',
  styleUrls: ['./name-server.component.css']
})
export class NameServerComponent {

  domainId: number = 0;
  organisationId: number = 0;
  applicationId: string = '';

  constructor(private router: Router){
    this.organisationId = this.router.getCurrentNavigation().extras?.state['organisationId'] | 0;
    this.domainId = this.router.getCurrentNavigation().extras?.state['domainId'] | 0;
    this.applicationId = this.router.getCurrentNavigation().extras?.state['applicationId'];
    console.log(this.organisationId);
    console.log(this.domainId);
    console.log(this.applicationId);
  }

}
