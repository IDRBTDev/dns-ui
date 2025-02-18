import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomainService } from '../rgnt-domain/service/domain.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-rgtr-domain',
  templateUrl: './rgtr-domain.component.html',
  styleUrls: ['./rgtr-domain.component.css']
})
export class RgtrDomainComponent {

  displayedColumns: string[] = [
    // 'checkbox',
    'domainId',
    'domainName',
    'orgName',
    'registrationDate',
    'renewalDate',
    'status',
  ]; // Matches matColumnDef values

  domainsList: any[] = [];
  domainsDataSource: MatTableDataSource<any>;
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
    // if(this.role !== 'IDRBTADMIN'){
    //   console.log('exe')
    //   this.getAllDomainsList(this.userEmailId);
    // }else{
    //   console.log('exe 1')
      this.getAllDomainsListByOrgId(0);
    //}
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

  async getAllDomainsListByOrgId(orgId: number) {
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
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase(); // Get the filter text
  
    this.domainsDataSource.filterPredicate = (data: any, filter: string) => {
   
      const displayedColumnsValues = this.displayedColumns.map(column => {
        if (column === 'registrationDate' || column === 'renewalDate') {
          // For date columns, format the date to 'MMM d, y, h:mm a' format
          const dateValue = data[column];
          console.log(dateValue)
          return this.formatDate(new Date(dateValue));
        }else if(column === 'domainName'){
          const domainName = data.domainName?.toString().toLowerCase() || "";
                const bankName = data.bankName?.toString().toLowerCase() || "";
                // console.log(domainName+bankName)
                return bankName+domainName; // Combine for filtering
        } else {
          // For non-date columns, return the column value
          return data[column];
        }
      });
  
      // Perform a case-insensitive search across the columns
      return displayedColumnsValues.some(value =>
        value?.toString().toLowerCase().includes(filter)
      );
    };
  
    // Apply the filter value to the data source
    this.domainsDataSource.filter = filterValue;
  
    // Reset paginator to the first page after filtering
    if (this.domainsDataSource.paginator) {
      this.domainsDataSource.paginator.firstPage();
    }
  }
  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return date.toLocaleDateString('en-US', options);
 
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
