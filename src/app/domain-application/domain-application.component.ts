import { HttpStatusCode } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { DomainService } from '../rgnt-domain/service/domain.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Domain } from '../model/domain.model';
import { TransactionRequest } from '../model/TransactionRequest.model';
import { DomainInvoiceService } from '../domain-invoices/service/domain-invoices.service';
import { DomainApplicationService } from './service/domain-application.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
//import { AES256Bit } from './service/encryption.service';

@Component({
  selector: 'app-domain-application',
  templateUrl: './domain-application.component.html',
  styleUrls: ['./domain-application.component.css']
})
export class DomainApplicationComponent {

  paymentForm: FormGroup;
  // @ViewChild('paymentForm') paymentFormElement: any;

  EncryptTrans: string = '';
  merchIdVal: string = '1000605';

  role: string = localStorage.getItem('userRole');
  userEmailId = localStorage.getItem('email');

  displayedColumns: string[] = [
    //initialized in ngOninit based on the role
  ]; // Matches matColumnDef values

  domainsList: any[];
  domainsDataSource: MatTableDataSource<any>;
  transactionReqObj:TransactionRequest=new TransactionRequest();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchText: string = '';
  constructor(private fb: FormBuilder, private domainService: DomainService, private router: Router,private dialog: MatDialog,private domainApplicationService:DomainApplicationService, private http: HttpClient) {
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

  // this.submitPayment();
  console.log(this.role)
  console.log(this.userEmailId)
  if(this.role !== 'IDRBTADMIN'){
    console.log('exe')
    this.getAllDomainsList(this.userEmailId);
    this.displayedColumns=[
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
    'payment'
    ]
  }else{
    console.log('exe 1')
    this.displayedColumns=[
      // 'checkbox',
   'domainId',
   'organisationName',
   'domainName',
   'submissionDate',
   'status',
   'paymentStatus',
   'nsRecordStatus',
   // 'industry',
   'tenure'
   ]
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
    this.processPayment();
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
   console.log("filterd data is:",filters);
    this.domainService.getFilteredData(this.filters).subscribe(
      (response) => {
        // Check if the response has data
        console.log(response)
        if (response.body && response.body.length > 0) {
          this.domainsList = response.body;
          console.log(this.domainsList)
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
    if(this.role === 'IDRBTADMIN'){
      this.router.navigate(['/domain-application-details'], { queryParams: { domainId: domainId } });
    }else{
      this.router.navigate(['/rngt-app-details'], { queryParams: { domainId: domainId } });
    }
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
    applicationId:'',
    userId: this.userEmailId,
    organisationName: '',
    domainName:'',
    nsRecordStatus: '',
    status: '',
    submissionDateFrom: '', // Add this field for the "From" date
    submissionDateTo: '' 
  };

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

  filterButton() {
    // Assuming you have a filter object with values (e.g., from input fields)
    console.log(this.filters.submissionDateFrom)
    const filters = {
      userId:this.userEmailId,
      applicationId:this.filters.applicationId,
      organisationName: this.filters.organisationName,
      domainName:this.filters.domainName, // The value entered by the user
      nsRecordStatus: this.filters.nsRecordStatus,    // The value entered by the user
      status: this.filters.status, 
      submissionDateFrom:this.filters.submissionDateFrom,
      submissionDateTo:this.filters.submissionDateTo
    };

    // Store the filters in localStorage as a JSON string
    localStorage.setItem('filters', JSON.stringify(filters));

    // Clear the noDataFound flag and fetch filtered data
    this.noDataFound = false;
    this.getFilteredDomains(); // Fetch the filtered data
    // window.location.reload();
  }
  noDataFound: boolean = false;

  clearButton() {

    //localStorage.removeItem('filters');

    // Clear any local filter variables
    this.filters.organisationName = '';
    this.filters.domainName='',
    this.filters.nsRecordStatus = '';
    this.filters.status = '';
    this.filters.submissionDateFrom= '', // Add this field for the "From" date
    this.filters.submissionDateTo= '';
    this.filters.applicationId=''
    localStorage.setItem('filters', JSON.stringify(this.filters));

    // Fetch all domains without any filters
    if (this.role !== 'IDRBTADMIN') {
      console.log('exe')
     
      this.getAllDomainsList(this.userEmailId);
    
   
    } else {
    
      this.getAllDomainsList("");
   
  }
  }
  processPayment(){
  this.domainApplicationService.processPayment().subscribe(   
    (response: string) => {    
       console.log('Encrypted Response:', response);
       this.paymentForm = this.fb.group({
        encryptTrans: response,
        merchIdVal: '1000605'
      });
       this.EncryptTrans = response; 
       this.merchIdVal = '1000605';
      },  (error) => {     
        console.error('HTTP Error:', error); 
      } );
    }
  updatePaymentSatus(domain:Domain) {
   domain.paymentStatus='processing'
   this.domainService.updateDomainDetails(domain).subscribe({
    next:(response)=>{
      this.getAllDomainsList(this.userEmailId)
    },error:(error)=>{

    }
   })
  }

  onSubmit1(): void {
    if (this.paymentForm.valid) {
      const formData =  {
        encryptTrans: this.EncryptTrans,
        merchIdVal: '1000605'
    };
      console.log(formData);
      // Here you can send the form data to the server or perform other actions.
      this.http.post('https://test.sbiepay.sbi/secure/AggregatorHostedListener', formData)
        .subscribe(response => {
          console.log('Payment submitted successfully', response);
        }, error => {
          console.error('Error submitting payment', error);
        });
    }
  }

  onSubmit2() {     // Code to manually submit the form
    const ecomForm = document.forms['ecom'];     
    if (ecomForm) {       
      ecomForm.submit(); 
    } 
  }

 async submitPayment() {
    const paymentData = {
      merchantId: "1000605",
      operatingMode: "DOM",
      // merchantKey : "pWhMnIEMc4q6hKdi2Fx50Ii8CKAoSIqv9ScSpwuMHM4=",
      merchantCountry: "IN",
      merchantCurrency: "INR",
      orderAmount: 100,
      otherDetails: "Other",
      successURL: "http://localhost:4200",
      failURL: "http://localhost:4200",
      aggregatorId: "SBIEPAY",
      merchantOrderNo:"12345",
      merchantCustomerID: "12345",
      payMode : "NB",
      // actionUrl: "https://test.sbiepay.sbi/secure/AggregatorHostedListener",
      accessMedium: "ONLINE",
      transactionSource: "ONLINE"
    };
    // const encryptionKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Base64);
    // const dataString = JSON.stringify(paymentData);
    const dataString = `${paymentData.merchantId}|${paymentData.operatingMode}|${paymentData.merchantCountry}|${paymentData.merchantCurrency}|${paymentData.orderAmount}|${paymentData.otherDetails}|${paymentData.successURL}|${paymentData.failURL}|${paymentData.aggregatorId}|${paymentData.merchantOrderNo}|${paymentData.merchantCustomerID}|${paymentData.payMode}|${paymentData.accessMedium}|${paymentData.transactionSource}`;
    console.log(dataString);
    const key_Array = "pWhMnIEMc4q6hKdi2Fx50Ii8CKAoSIqv9ScSpwuMHM4=";
    const decodedKey = atob(key_Array);  // Decodes Base64 string to a string of bytes
    const keyArray = new Uint8Array(decodedKey.length);
    // const singleRequest = 'Some request data to encrypt';

    // Encrypt the data
    // const encryptedResponse = await this.encrypt(dataString, keyArray);
    // console.log(dataString);
    // console.log(encryptedResponse);

    // const encryptedData = CryptoJS.AES.encrypt(dataString, encryptionKey).toString();
    // console.log(encryptedData);
    // this.EncryptTrans = encryptedResponse;
    // Convert the payment data object to a JSON stringconst dataString = JSON.stringify(paymentData);
  //   this.domainApplicationService.submitPayment({encryptedData}).subscribe(
  //     (response) => {
  //       console.log('Payment submitted successfully:', response);
  //       // Handle response here, such as redirecting the user or showing a message
  //       window.location.href = response.body;
  //     },
  //     (error) => {
  //       console.error('Payment submission failed:', error);
  //       // Handle error here, such as displaying an error message
  //     }
  //   );
   }


   formData = {
    encryptTrance: '',
    encryptValue: ''
  };

  

  onSubmit() {
    // Replace 'YOUR_API_URL' with your actual API endpoint
    const apiUrl = 'https://test.sbiepay.sbi/secure/AggregatorHostedListener';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Origin': 'http://localhost:4200',
      // 'Referer': 'http://localhost:4200',
    });
    
    this.http.post(apiUrl, this.formData, { headers })
      .subscribe({
        next: (response) => {
          console.log('Form submitted successfully', response);
          // Handle success response here
        },
        error: (error) => {
          console.error('Error submitting form', error);
          // Handle error here
        }
      });
  }

}
