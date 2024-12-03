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

  role: string = localStorage.getItem('userRole');
  userEmailId = localStorage.getItem('email');

  displayedColumns: string[] = [
    // 'checkbox',
    'domainId',
    'organisationName',
    'domainName',
    'submissionDate',
    'status',
    'paymentStatus',
    'nsRecordStatus',
    // 'industry',
    'tenure',

  ]; // Matches matColumnDef values

  domainsList: any[];
  domainsDataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchText: string = '';
  constructor(private domainService: DomainService, private router: Router) {
    this.domainsDataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    localStorage.setItem('isBoxVisible', 'false');
    console.log(this.role)
    console.log(this.userEmailId)
    if (this.role !== 'IDRBTADMIN') {
      console.log('exe')
      this.getAllDomainsList(this.userEmailId);
    } else {
      console.log('exe 1')
      this.getAllDomainsList("");
    }
    //this.getFilteredDomains();
    // const savedFilters = localStorage.getItem('filters');

    // if (savedFilters) {
    //   const filters = JSON.parse(savedFilters);

    //   // Set the filter values in your component from the saved data
    //   this.filters.organisationName = filters.organisationName || '';
    //   this.filters.nsRecordStatus = filters.nsRecordStatus || '';
    //   this.filters.status = filters.status || '';


    //   // Apply the filters to get the filtered data
    //   this.getFilteredDomains();
    // } else {
    //   // No filters found, so just fetch all data
    //   this.getFilteredDomains();
    // }
  }

  async getAllDomainsList(userId: string) {
    await lastValueFrom(this.domainService.getAllDomains(userId)).then(
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
  getFilteredDomains(): void {
    const filters = JSON.parse(localStorage.getItem('filters') || '{}'); // Retrieve filters from localStorage
  
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
          // If no data is found, display the "No results found" message
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
  
  navigateToDomainDetails(domainId: number) {
    this.router.navigate(['/domain-application-details'], { queryParams: { domainId: domainId } });
  }
  navigateToSessionTimeout() {
    this.router.navigateByUrl('/session-timeout');
  }
  applyFilter() {
    this.domainsDataSource.filter = this.searchText.trim().toLowerCase(); // Filters based on search text

    if (this.domainsDataSource.paginator) {
      this.domainsDataSource.paginator.firstPage(); // Reset paginator to the first page after filtering
    }
  }

  filters = {
    userId: '',
    organisationName: '',
    nsRecordStatus: '',
    status: '',
    submissionDate: ''
  };

  resetFilters(): void {
    this.filters = {
      userId: '',
      organisationName: '',
      nsRecordStatus: '',
      status: '',
      submissionDate: ''
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
    window.location.reload();
  }
  noDataFound: boolean = false;

  clearButton() {

    localStorage.removeItem('filters');

    // Clear any local filter variables
    this.filters.organisationName = '';
    this.filters.nsRecordStatus = '';
    this.filters.status = '';


    // Fetch all domains without any filters
    this.getFilteredDomains();
  }

}
