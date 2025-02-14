import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomainService } from './service/domain.service';
import { lastValueFrom } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../user/service/user.service';

@Component({
  selector: 'app-rgnt-domain',
  templateUrl: './rgnt-domain.component.html',
  styleUrls: ['./rgnt-domain.component.css'],
})
export class RgntDomainComponent implements OnInit {
  displayedColumns: string[] = [
    // 'checkbox',
    'domainId',
    'status',
    'domainName',
    'organizationName',
    'registrationDate',
    'renewalDate',
  ]; // Matches matColumnDef values

  domainsList: any[];
  domainsDataSource: MatTableDataSource<any>;
  // organisationId=  parseInt(localStorage.getItem('organisationId'));
  organisationId: number=0 ;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  role: string = localStorage.getItem('userRole');
  userEmailId = localStorage.getItem('email');
  searchText:String='';
  constructor(private domainService: DomainService, private router: Router,private userService:UserService,) {
    this.domainsDataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {


    localStorage.setItem('isBoxVisible', 'false');

  
    console.log(this.role)
    console.log(this.userEmailId)
    console.log(this.organisationId);
    // if(this.role !== 'IDRBTADMIN'){
    
    //   console.log('exe')
    this.fetchOrgIdAndDomainsOfit();
    // }else{
      //console.log('exe 1')
      //this.getAllDomainsList(this.userEmailId);
    //}
  }
  async fetchOrgIdAndDomainsOfit(){
    await lastValueFrom(this.userService.getUserByEmailId(this.userEmailId)).then(
       (response) => {
       
           console.log(response)
           this.organisationId=response.body.organisationId;
        
           if(this.organisationId > 0){
            this.getAllDomainsListByOrgId(this.organisationId);
          }else{
            this.domainsList = [];
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
//   applyFilter() {
//     this.domainsDataSource.filter = this.searchText.trim().toLowerCase(); // Filters based on search text
    
//     if (this.domainsDataSource.paginator) {
//       this.domainsDataSource.paginator.firstPage(); // Reset paginator to the first page after filtering
//     }
// }


//   applyFilter() {
//   const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase(); // Get the filter text

//   this.domainsDataSource.filterPredicate = (data: any, filter: string) => {
 
//     const displayedColumnsValues = this.displayedColumns.map(column => {
//       if (column === 'registrationDate' || column === 'renewalDate') {
//         // For date columns, format the date to 'MMM d, y, h:mm a' format
//         const dateValue = data[column];
//         return this.formatDate(new Date(dateValue.endsWith('Z') ? dateValue : dateValue + 'Z'));
//       } else {
//         // For non-date columns, return the column value
//         return data[column];
//       }
//     });

//     // Perform a case-insensitive search across the columns
//     return displayedColumnsValues.some(value =>
//       value?.toString().toLowerCase().includes(filter)
//     );
//   };

//   // Apply the filter value to the data source
//   this.domainsDataSource.filter = filterValue;

//   // Reset paginator to the first page after filtering
//   if (this.domainsDataSource.paginator) {
//     this.domainsDataSource.paginator.firstPage();
//   }
// }

applyFilter() {
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase(); // Get the filter text

  this.domainsDataSource.filterPredicate = (data: any, filter: string) => {
 
    const displayedColumnsValues = this.displayedColumns.map(column => {
      if (column === 'registrationDate' || column === 'renewalDate') {
        // For date columns, format the date to 'MMM d, y, h:mm a' format
        const dateValue = data[column];
        return this.formatDate(new Date(dateValue.endsWith('Z') ? dateValue : dateValue + 'Z'));
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
    month: 'short',  // 'Jan', 'Feb', etc.
    day: 'numeric',  // '30', '1', etc.
    year: 'numeric', // '2025', '2026', etc.
    hour: 'numeric', // '3', '12', etc.
    minute: 'numeric', // '46', '30', etc.
    hour12: true, // AM/PM format
  };

  return date.toLocaleString('en-US', options); // Format as 'Jan 30, 2025, 3:46 PM'
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
