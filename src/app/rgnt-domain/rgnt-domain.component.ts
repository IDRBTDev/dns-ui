import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomainService } from './service/domain.service';
import { lastValueFrom } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rgnt-domain',
  templateUrl: './rgnt-domain.component.html',
  styleUrls: ['./rgnt-domain.component.css'],
})
export class RgntDomainComponent implements OnInit {
  displayedColumns: string[] = [
    // 'checkbox',
    'domainId',
    'domainName',
    'orgName',
    'regDate',
    'renewalDate',
    'status',
  ]; // Matches matColumnDef values

  domainsList: any[];
  domainsDataSource: MatTableDataSource<any>;
  organisationId: number =  parseInt(localStorage.getItem('organisationId'));
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  role: string = localStorage.getItem('userRole');
  userEmailId = localStorage.getItem('email');
  searchText:String='';
  constructor(private domainService: DomainService, private router: Router) {
    this.domainsDataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {


    localStorage.setItem('isBoxVisible', 'false');

  
    console.log(this.role)
    console.log(this.userEmailId)
    console.log(this.organisationId);
    // if(this.role !== 'IDRBTADMIN'){
    //   console.log('exe')
    if(this.organisationId > 0){
      this.getAllDomainsListByOrgId(this.organisationId);
    }else{
      this.domainsList = [];
    }
    // }else{
      //console.log('exe 1')
      //this.getAllDomainsList(this.userEmailId);
    //}
  }

  async getAllDomainsListByOrgId(orgId: number) {
    console.log(orgId)
    await lastValueFrom(this.domainService.getAllDomainsByOrgId(orgId)).then(
      (response) => {
        if (response.status === HttpStatusCode.Ok) {
          this.domainsList = response.body;
          console.log(this.domainsList)
          this.domainsDataSource.data = this.domainsList;
          setTimeout(() => {
            this.domainsDataSource.sort = this.sort;
            this.domainsDataSource.paginator = this.paginator;
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
  
  async getAllDomainsList(userId: string) {
    await lastValueFrom(this.domainService.getAllDomains(userId)).then(
      (response) => {
        if (response.status === HttpStatusCode.Ok) {
          this.domainsList = response.body;
          console.log(this.domainsList)
          this.domainsDataSource.data = this.domainsList;
          setTimeout(() => {
            this.domainsDataSource.sort = this.sort;
            this.domainsDataSource.paginator = this.paginator;
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
    this.router.navigate(['/domain-details'],{queryParams:{domainId:domainId}});
  }

  navigateToSessionTimeout() {
    this.router.navigateByUrl('/session-timeout');
  }

  navigateToAddDomain(){
    this.router.navigateByUrl('/add-domain');
  }
  applyFilter() {
    this.domainsDataSource.filter = this.searchText.trim().toLowerCase(); // Filters based on search text

    if (this.domainsDataSource.paginator) {
      this.domainsDataSource.paginator.firstPage(); // Reset paginator to the first page after filtering
    }
}

getFilteredDomains(): void {
  const filters = JSON.parse(localStorage.getItem('filters') || '{}'); // Retrieve filters from localStorage

  // Make sure that if the filters are empty, it handles properly
  if (!filters.organisationName && !filters.nsRecordStatus && !filters.status) {
    // If there are no filters applied, fetch all data (you might want to have a fallback here)
    this.getAllDomainsList(this.userEmailId);
    return;
  }

  this.domainService.getFilteredData(filters).subscribe(
    (response) => {
      // Check if the response has data
      if (response.body && response.body.length > 0) {
        this.domainsList = response.body;
        this.domainsDataSource.data = this.domainsList;
        this.domainsDataSource.paginator = this.paginator;
        this.domainsDataSource.sort = this.sort;
        this.noDataFound = false; // Hide "No results" message if data is found
      } else {
        // If no data is found, clear the table and show "No results" message
        this.domainsList = []; // Ensure the data list is empty
        this.domainsDataSource.data = this.domainsList; // Set the data source to empty
        this.noDataFound = true; // Set the flag to true to show "No results" message
      }
    },
    (error) => {
      console.error('Error fetching filtered domains:', error);
      this.noDataFound = true; // In case of error, show "No results" message
    }
  );
}


filters = {
  userId: '',
  domainName:'',
  organisationName: '',
  nsRecordStatus: '',
  status: '',
  submissionDate:''
};

resetFilters(): void {
  this.filters = {
    userId: '',
    domainName:'',
    organisationName: '',
    nsRecordStatus: '',
    status: '',
    submissionDate:''
  };
 this.getFilteredDomains();
}

filterButton() {
  // Assuming you have a filter object with values (e.g., from input fields)
  const filters = {
    organisationName: this.filters.organisationName, // The value entered by the user
    nsRecordStatus: this.filters.nsRecordStatus,    // The value entered by the user
    status: this.filters.status,                     // The value entered by the user
  };

  // Store the filters in localStorage as a JSON string
  localStorage.setItem('filters', JSON.stringify(filters));

  // Clear the noDataFound flag and fetch filtered data
  this.noDataFound = false;
  this.getFilteredDomains(); // Fetch the filtered data
}

  noDataFound: boolean = false;

  clearButton(){
   
      localStorage.removeItem('filters');
      
      this.filters.organisationName= '';
      this.filters.nsRecordStatus = '';
      this.filters.status = '';
      this.filters.domainName='';
     
      this.getFilteredDomains();
    }
  
}
