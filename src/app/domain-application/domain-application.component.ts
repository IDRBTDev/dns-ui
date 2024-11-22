import { HttpStatusCode } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { DomainService } from '../domain/service/domain.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-domain-application',
  templateUrl: './domain-application.component.html',
  styleUrls: ['./domain-application.component.css']
})
export class DomainApplicationComponent {

  displayedColumns: string[] = [
    'checkbox',
    'domainId',
    'organisationName',
    'domainName',
    'submissionDate',
    'nsRecordStatus',
    'industry',
    'tenure',
  ]; // Matches matColumnDef values

  domainsList: any[];
  domainsDataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private domainService: DomainService, private router: Router) {
    this.domainsDataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.getAllDomainsList();
  }

  async getAllDomainsList() {
    await lastValueFrom(this.domainService.getAllDomains()).then(
      (response) => {
        if (response.status === HttpStatusCode.Ok) {
          this.domainsList = response.body;
          this.domainsDataSource.data = this.domainsList;
          this.domainsDataSource.paginator = this.paginator;
          setTimeout(() => {
            this.domainsDataSource.sort = this.sort;
          }, 0);
        }
      },
      (error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.navigateToSessionTimeout();
        }
      }
    );
  }
  navigateToDomainDetails(domainId: number){
    this.router.navigate(['/domain-application-details'],{queryParams:{domainId:domainId}});
  }
  navigateToSessionTimeout() {
    this.router.navigateByUrl('/session-timeout');
  }

}
