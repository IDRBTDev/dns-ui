import { HttpStatusCode } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { DomainService } from '../rgnt-domain/service/domain.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-domain-application',
  templateUrl: './domain-application.component.html',
  styleUrls: ['./domain-application.component.css']
})
export class DomainApplicationComponent {


  @ViewChild('paymentDialog') paymentDialog!: TemplateRef<any>;
  selectedFile: File | null = null;
  dialogRef!: MatDialogRef<any>;
  selectedFileName: string = 'No File Selected';
  domainId: string | null = null;

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
  constructor(private domainService: DomainService, private router: Router,private dialog: MatDialog) {
    this.domainsDataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
  //   console.log(this.role)
  //   console.log(this.userEmailId)
  //   const d=JSON.parse(localStorage.getItem('filters'))
  //   console.log(d.status)
  //   if (this.role !== 'IDRBTADMIN') {
  //     console.log('exe')
  //     if(d.status ==="" && d.nsRecordStatus === "" && d.organisationName ==="" && d.submissionDateFrom ==="" && d.submissionDateTo==="")
  //     this.getAllDomainsList(this.userEmailId);
  //   else
  //  // this.getFilteredDomains();
  //   } else {
  //     console.log('exe 1')
  //     if(d.status ==="" && d.nsRecordStatus === "" && d.organisationName ==="" && d.submissionDate ==="" && d.submissionDateFrom==="" && d.submissionDateTo==="")
  //     this.getAllDomainsList("");
  //   else
  // //  this.getFilteredDomains();
  //   }
  console.log(this.role)
  console.log(this.userEmailId)
  if(this.role !== 'IDRBTADMIN'){
    console.log('exe')
    this.getAllDomainsList(this.userEmailId);
  }else{
    console.log('exe 1')
    this.getAllDomainsList("");
  }

    // localStorage.setItem('isBoxVisible', 'false');
    // console.log(this.role)
    // console.log(this.userEmailId)
    // const d=JSON.parse(localStorage.getItem('filters'))
    // console.log(d.status)
    // if (this.role !== 'IDRBTADMIN') {
    //   console.log('exe')
    //   if(d.status ==="" && d.nsRecordStatus === "" && d.organisationName ==="" && d.submissionDate ==="")
    //   this.getAllDomainsList(this.userEmailId);
    // else
    // this.getFilteredDomains();
    // } else {
    //   console.log('exe 1')
    //   if(d.status ==="" && d.nsRecordStatus === "" && d.organisationName ==="" && d.submissionDate ==="")
    //   this.getAllDomainsList("");
    // else
    // this.getFilteredDomains();
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
  // getFilteredDomains(): void {
  //   const filters = JSON.parse(localStorage.getItem('filters') || '{}'); // Retrieve filters from localStorage
  //  console.log("filterd data is:",filters);
  //   this.domainService.getFilteredData(filters).subscribe(
  //     (response) => {
  //       // Check if the response has data
  //       if (response.body && response.body.length > 0) {
  //         this.domainsList = response.body;
  //         this.domainsDataSource.data = this.domainsList;
  //         this.domainsDataSource.paginator = this.paginator;
  //         this.domainsDataSource.sort = this.sort;
  //         this.noDataFound = false; // Hide "No results" message if data is found
  //       } else {
  //         // If no data is found, display the "No results found" message
  //         this.domainsList = []; // Ensure the data list is empty
  //         this.domainsDataSource.data = this.domainsList; // Set the data source to empty
  //         this.noDataFound = true; // Set the flag to true to show "No results" message
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching filtered domains:', error);
  //       this.noDataFound = true; // In case of error, show "No results" message
  //     }
  //   );
  // }
  openPaymentDialog(domainId: string): void {
    this.dialogRef = this.dialog.open(this.paymentDialog, {
      width: '400px',
      data: { domainId },
    });
    this.domainId = domainId;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = input.files[0].name; 
      console.log(`File selected: ${this.selectedFile.name}`);
    }
  } 
  async confirmPayment(): Promise<void> {
    if (this.selectedFile) {
        const domainId = this.domainId;
        const formData = new FormData();
        formData.append('file', this.selectedFile, this.selectedFile.name);
        formData.append('domainId', domainId);

        try {
            const response = await lastValueFrom(this.domainService.uploadPaymentReceipt(formData));
            console.log('Server Response:', response); // Plain text response
            this.dialogRef.close();
        } catch (error) {
            console.error('Error uploading payment receipt:', error);
        }
    } else {
        console.error('No file selected');
    }
}


  onDialogClose(): void {
    this.dialogRef.close();
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

  // filters = {
  //   userId: '',
  //   organisationName: '',
  //   nsRecordStatus: '',
  //   status: '',
  //   submissionDateFrom: '', // Add this field for the "From" date
  //   submissionDateTo: '' 
  // };

  // resetFilters(): void {
  //   this.filters = {
  //     userId: '',
  //     organisationName: '',
  //     nsRecordStatus: '',
  //     status: '',
  //     submissionDateFrom: '', // Add this field for the "From" date
  // submissionDateTo: '' 
  //   };
  //   this.getFilteredDomains();
  // }

  // filterButton() {
  //   // Assuming you have a filter object with values (e.g., from input fields)
  //   const filters = {
  //     organisationName: this.filters.organisationName, // The value entered by the user
  //     nsRecordStatus: this.filters.nsRecordStatus,    // The value entered by the user
  //     status: this.filters.status, 
  //     submissionDateFrom:this.filters.submissionDateFrom,
  //     submissionDateTo:this.filters.submissionDateTo

  //   };

  //   // Store the filters in localStorage as a JSON string
  //   localStorage.setItem('filters', JSON.stringify(filters));

  //   // Clear the noDataFound flag and fetch filtered data
  //   this.noDataFound = false;
  //   this.getFilteredDomains(); // Fetch the filtered data
  //   window.location.reload();
  // }
  // noDataFound: boolean = false;

  // clearButton() {

  //   //localStorage.removeItem('filters');

  //   // Clear any local filter variables
  //   this.filters.organisationName = '';
  //   this.filters.nsRecordStatus = '';
  //   this.filters.status = '';
  //   this.filters. submissionDateFrom= '', // Add this field for the "From" date
  //   this.filters. submissionDateTo= '';
  //   localStorage.setItem('filters', JSON.stringify(this.filters));

  //   // Fetch all domains without any filters
  //   if (this.role !== 'IDRBTADMIN') {
  //     console.log('exe')
     
  //     this.getAllDomainsList(this.userEmailId);
    
   
  //   } else {
    
  //     this.getAllDomainsList("");
   
  // }
  // }
}
