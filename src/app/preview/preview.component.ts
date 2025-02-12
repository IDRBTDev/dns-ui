import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { DomainService } from '../rgnt-domain/service/domain.service';
import { lastValueFrom } from 'rxjs';
import { NameServerService } from '../name-server-form/service/name-server.service';
import { ContactDetailsFormService } from '../contact-details-form/service/contact-details-form.service';
import { Router } from '@angular/router';
import { OrganisationDetailsService } from '../organisation-details/service/organisation-details.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user/service/user.service';
import { DocumentUploadComponent } from '../document-upload/document-upload.component';
import { NotificationService } from '../notification/service/notification.service';
import { ChangeDetectorRef } from '@angular/core';
import { DscVerificationComponent } from '../dsc-verification/dsc-verification.component';
import * as bootstrap from 'bootstrap';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-preview',

  templateUrl: './preview.component.html',

  styleUrls: ['./preview.component.css'],
})
export class PreviewComponent implements OnInit, OnChanges {
  @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() back: EventEmitter<void> = new EventEmitter<void>(); // Emit event after form submission
  @ViewChild(DocumentUploadComponent, { static: false }) documentUploadComponent?: DocumentUploadComponent;
  @ViewChild(DscVerificationComponent, { static: false }) dscVerificationComponent!: DscVerificationComponent;
  @Input() organisationId: number = 0;
  @Input() domainId: number = 0;

  userId: string = localStorage.getItem('email');
  role: string = localStorage.getItem('userRole');
  notificationList: any[] = [];
  notificationCount = 0;
  notificationError: string | null = null; // Holds error messages if any
  private environmentApiUrl = environment.apiURL;
  formData = {
    name: '',
    organisationName: '',
    designation: '',
  };
  
  tokenPassword = '';
  passwordErrorMessage = '';
  isSigned= false;
  isLoading : boolean = false;
  tokens: any[] = [];
  certificates: any[] = [];
  
  dataTypes: string[] = [
    'TextPKCS7',
    'TextPKCS1',
    'XML',
    'Sha256HashPKCS7',
    'Sha256HashPKCS1',
    'TextPKCS7ATTACHED'
  ];
  selectedToken: any = null;
  selectedCertificate: any = null;
  selectedDataType: string = '';
  embridgeUrl = 'https://localhost.emudhra.com:26769';
  dscApi = '';
  enable: boolean = true;


  // domainDetails: any;
  // administrativeDetails: any;
  // billingDetails: any;
  // technicalDetails: any;
  // nameServerDetails: any;
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['organisationId']) {
      this.organisationId = changes['organisationId'].currentValue;
      console.log('organisationId changed:', changes['organisationId'].currentValue);
      // Add custom logic here for handling the updated data
    }
  }

  private modalInstance: bootstrap.Modal | null = null;

  ngOnInit(): void {
    console.log("this is the org id from the onboarding stepper"+this.organisationId)
    console.log("this is the org id from the onboarding stepper"+this.domainId)
    this.fetchDataFromAPIs();
    this.loadNotifications();
  }


  cards = [
    {
      heading: 'Domain Applying For',

      details: {
        domainId: 0,
        applicationId:0,
        bankName: '',
        organizationName:'',
        domainName: '',
        industry:'',
        numberOfYears: '',
        nsRecordStatus:'',
        organisationId:this.organisationId,
        cost: 0,
        paymentStatus:'',
        registrationDate:'',
        renewalDate:'',
        status:'',
        submissionDate:'',
        userName:'',
        userMailId:'',
        isEditing: false,
        applicationStatus:'Pending'
      },
    },

    {
      heading: 'Organisation Details',

      details: {
        organisationDetailsId: 0,
        institutionName: '',
        applicationId:0,
        userMailId:0,
        pincode: '',
        city: '',
        state: '',
        address: '',
        stdTelephone: '',
        mobileNumber: '',
        organisationEmail: '',
        isEditing: false,
      },
    },

    {
      heading: 'Administrative Contact',

      details: {
        administrativeContactId:0,
        adminFullName: '',
        adminEmail: '',
        adminPhone: '',
        adminAltPhone: '',
        adminDesignation: '',
        adminAddress: '',
        organisationId:this.organisationId,
        adminDocuments: '',
        applicationId:0,
        userMailId:0,
        isEditing: false,

      },
    },

    {
      heading: 'Technical Contact',

      details: {
        technicalContactId:0,
        techFullName: '',
        techEmail: '',
        techPhone: '',
        techAltPhone: '',
        techDesignation: '',
        techAddress: '',
        applicationId:0,
        userMailId:0,
        techDocuments: '',
        organisationId:this.organisationId,
        isEditing: false,
      },
    },

    {
      heading: 'Billing Contact',

      details: {
        organisationalContactId:0,
        billFullName: '',
        billEmail: '',
        billPhone: '',
        billAltPhone: '',
        billDesignation: '',
        billAddress: '',
        billDocuments: '',
        applicationId:0,
        userMailId:0,
        organisationId:this.organisationId,
        isEditing: false,
      },
    },

    {
      heading: 'Name Server Details',

      details: {
        nameServerId:0,
        hostName: '',
        organisationId:this.organisationId,
        applicationId:'',
        domainId:0,
        ipAddress: '',
        ttl:0,
        userMailId:'',
        isEditing: false,
      },
    },
  ];

  constructor(private http: HttpClient,
    private domainService: DomainService,
    private namServerService: NameServerService,
    private conatctFormService: ContactDetailsFormService,
    private organisationService: OrganisationDetailsService,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
 
   * Fetch data from different APIs and populate card details
 
   */
  goBack(): void {
    this.back.emit();
  }

  async onSubmit(): Promise<void> {
    this.formSubmitted.emit();
    //save the details into DB
    await this.updatePreviewDetails();
    this.cards[0].details.organizationName = this.cards[1].details.institutionName;

    const notification = {
      message: "Application submitted successfully",
      moduleType: "DocumentUpload",
      moduleRecordId: 102,
      notificationTo: this.userId,
      emailId: this.userId,
      status: "Unread",
      createdDateTime:  new Date().toISOString(), // Use ISO 8601 string for date/time
      createdByEmailId: this.userId,
      profilepic: null
    };
    
    // Create notification via the notification service
    this.notificationService.createNotification(notification).subscribe(response => {
        console.log('Notification created successfully:', response);
        this.loadNotifications();
      },
      error => {
        console.error('Error creating notification:', error);
      }
    );


  }

  // Inside the PreviewComponent
  loadNotifications(): void {
    console.log(this.userId);
    if (this.userId) {
      this.notificationService.getNotifications(this.userId).subscribe(
        (notifications: any[]) => {
          this.notificationList = notifications; // Bind to the template
          this.notificationCount = notifications.filter(n => n.status === 'Unread').length; // Update count
          this.cdr.detectChanges(); // Ensure view updates
          this.notificationError = null;
          console.log('Notifications loaded:', this.notificationList);
        },
        error => {
          this.notificationError = 'Error fetching notifications: ' + error.message;
          console.error('Error fetching notifications:', error);
        }
      );
    }
  }
  nameDetails:any

  fetchDataFromAPIs() {
    console.log(this.domainId);
     const headers = new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        });
    this.http.get<any>(this.environmentApiUrl+'/dr/domain/getDetails/'+this.domainId,{headers}).subscribe({
      next: response => {
        this.cards[0].details.bankName = response.bankName;
        this.cards[0].details.cost = response.cost;
        this.cards[0].details.applicationId = response.applicationId;
        this.cards[0].details.domainName = response.domainName;
        this.cards[0].details.industry = response.industry;
        this.cards[0].details.nsRecordStatus = response.nsRecordStatus;
        this.cards[0].details.numberOfYears = response.numberOfYears;
        this.cards[0].details.organisationId = this.organisationId;
        this.cards[0].details.organizationName = response.organizationName;
        this.cards[0].details.paymentStatus = response.paymentStatus;
        this.cards[0].details.registrationDate = response.registrationDate;
        this.cards[0].details.renewalDate = response.renewalDate;
        this.cards[0].details.status = response.status;
        this.cards[0].details.submissionDate = response.submissionDate;
        this.cards[0].details.userName = response.userName;
        this.cards[0].details.userMailId = response.userMailId;
        this.cards[0].details.domainId = response.domainId;
        this.cards[0].details.numberOfYears = response.numberOfYears;
        this.cards[0].details.cost = response.cost;
      }
    })
    console.log('exe preview comp - fecth data apis')
    // Fetch Organisation Details using getDetailsById
    this.http
      .get<any>(
        this.environmentApiUrl+'/dr/organisationDetails/getDetailsById/'+this.organisationId
      ,{headers})
      .subscribe({
        next: (data) => {
          console.log(data)
          this.cards[1].details.organisationDetailsId = data.organisationDetailsId;
          //this.cards
          this.cards[1].details.institutionName = data.institutionName;
          this.cards[1].details.pincode = data.pincode;
          this.cards[1].details.city = data.city;
          this.cards[1].details.state = data.state;
          this.cards[1].details.address = data.address;
          this.cards[1].details.stdTelephone = data.stdTelephone;
          this.cards[1].details.mobileNumber = data.mobileNumber;
          this.cards[1].details.organisationEmail = data.organisationEmail;
          this.cards[1].details.organisationId= this.organisationId;
          this.cards[1].details.userMailId = data.userMailId;
          this.cards[1].details.userName = data.userName;
          this.cards[1].details.applicationId = data.applicationId;


          // for signing
          this.formData.organisationName=data.institutionName;
        },
        error: (error) =>
          console.error('Error fetching organisation details:', error),
      });

    // Fetch Administrative Contact using getDetailsById
    this.http
      .get<any>(
        this.environmentApiUrl+'/dr/administrativeContact/get/'+this.organisationId,{headers}
      )
      .subscribe({
        next: (data) => {
          console.log(data)
          this.cards[2].details.administrativeContactId = data.administrativeContactId;
          this.cards[2].details.adminFullName = data.adminFullName;
          this.cards[2].details.adminEmail = data.adminEmail;
          this.cards[2].details.adminPhone = data.adminPhone;
          this.cards[2].details.adminAltPhone = data.adminAltPhone;
          this.cards[2].details.adminDesignation = data.adminDesignation;
          this.cards[2].details.adminAddress = data.adminAddress;
          this.cards[2].details.adminDocuments = data.documents;
          this.cards[2].details.organisationId= this.organisationId;
          this.cards[2].details.userMailId = data.userMailId;
          this.cards[2].details.userName = data.userName;
          this.cards[2].details.applicationId = data.applicationId;
          // for siginng
          this.formData.name=data.adminFullName;
          this.formData.designation=data.adminDesignation;
        },
        error: (error) =>
          console.error('Error fetching admin contact details:', error),
      });

    // Fetch Technical Contact using getDetailsById
    this.http
      .get<any>(
        this.environmentApiUrl+'/dr/technicalContact/get/'+this.organisationId,{headers}
      )
      .subscribe({
        next: (data) => {
          console.log(data)
          this.cards[3].details.technicalContactId = data.technicalContactId
          this.cards[3].details.techFullName = data.techFullName;
          this.cards[3].details.techEmail = data.techEmail;
          this.cards[3].details.techPhone = data.techPhone;
          this.cards[3].details.techAltPhone = data.techAltPhone;
          this.cards[3].details.techDesignation = data.techDesignation;
          this.cards[3].details.techAddress = data.techAddress;
          this.cards[3].details.techDocuments = data.documents;
          this.cards[3].details.organisationId= this.organisationId;
          this.cards[3].details.userMailId = data.userMailId;
          this.cards[3].details.userName = data.userName;
          this.cards[3].details.applicationId = data.applicationId;
        },
        error: (error) =>
          console.error('Error fetching tech contact details:', error),
      });

    // Fetch Billing Contact using getDetailsById
    this.http
      .get<any>(
        this.environmentApiUrl+'/dr/billingContact/get/'+this.organisationId,{headers}
      )
      .subscribe({
        next: (data) => {
          console.log(data)
          this.cards[4].details.organisationalContactId = data.organisationalContactId;
          this.cards[4].details.billFullName = data.billFullName;
          this.cards[4].details.billEmail = data.billEmail;
          this.cards[4].details.billPhone = data.billPhone;
          this.cards[4].details.billAltPhone = data.billAltPhone;
          this.cards[4].details.billDesignation = data.billDesignation;
          this.cards[4].details.billAddress = data.billAddress;
          this.cards[4].details.billDocuments = data.documents;
          this.cards[4].details.organisationId= this.organisationId;
          this.cards[4].details.userMailId = data.userMailId;
          this.cards[4].details.userName = data.userName;
          this.cards[4].details.applicationId = data.applicationId;
        },
        error: (error) =>
          console.error('Error fetching billing contact details:', error),
      });

    // Fetch Name Server Details using getDetailsById
    //this.namServerService.getNameServersByDomainId(this.domainId)
    this.http
      .get<any>(
        this.environmentApiUrl+'/dr/nameServer/getDetails/'+this.domainId,{headers}
      )
      .subscribe({
        next: (data) => {
          console.log(data)
          this.nameDetails=data;
          this.cards[5].details.nameServerId = data[0].nameServerId;
          this.cards[5].details.hostName = data[0].hostName;
          this.cards[5].details.ipAddress = data[0].ipAddress;
          this.cards[5].details.organisationId = this.organisationId;
          this.cards[5].details.applicationId = data[0].applicationId;
          this.cards[5].details.domainId = data[0].domainId;
          this.cards[5].details.ttl = data[0].ttl;
        },
        error: (error) =>
          console.error('Error fetching name server details:', error),
      });
      console.log(this.cards);
  }

  // Toggle edit mode for each card

  toggleEdit(card: any) {
    card.details.isEditing = !card.details.isEditing;
  }

  // Save changes for a specific card

  onSave(card: any) {
    console.log(
      `${card.heading}
   saved:`,
      card.details
    );

    card.details.isEditing = false;

    // Optionally, send updated data to the backend here
  }

  // Cancel changes for a specific card

  onCancel(card: any) {
    // Reset to original state (could use original data if needed)

    card.details.isEditing = false;

    console.log(`${card.heading}
   changes canceled.`);
  }

  async getDomainDetailsByDomainId(domainId: number){
    await lastValueFrom(this.domainService.getDomainByDomainId(domainId)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          this.cards[0].details.bankName = response.body.bankName;
        this.cards[0].details.cost = response.body.cost;
        this.cards[0].details.applicationId = response.body.applicationId;
        this.cards[0].details.domainName = response.body.domainName;
        this.cards[0].details.industry = response.body.industry;
        this.cards[0].details.nsRecordStatus = response.body.nsRecordStatus;
        this.cards[0].details.numberOfYears = response.body.numberOfYears;
        this.cards[0].details.organisationId = this.organisationId;
        this.cards[0].details.organizationName = response.body.organizationName;
        this.cards[0].details.paymentStatus = response.body.paymentStatus;
        this.cards[0].details.registrationDate = response.body.registrationDate;
        this.cards[0].details.renewalDate = response.body.renewalDate;
        this.cards[0].details.status = response.body.status;
        this.cards[0].details.submissionDate = response.body.submissionDate;
        this.cards[0].details.userName = response.body.userName;
        this.cards[0].details.userMailId = response.body.userMailId;
        this.cards[0].details.domainId = response.body.domainId;
        this.cards[0].details.numberOfYears = response.body.numberOfYears;
        this.cards[0].details.cost = response.body.cost;
      }
    }
    )
  }

  async updateDomainDetails(){
    console.log("orgid in previw page"+this.organisationId)
    console.log(this.cards[1].details.institutionName);
    this.cards[0].details.organisationId=this.organisationId;
    this.cards[0].details.organizationName = this.cards[1].details.institutionName;
    await lastValueFrom(this.domainService.updateDomainDetails(this.cards[0].details)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          console.log('Domain details updated successfully.');
        }
      }, error => {
        if(error.status === HttpStatusCode.Unauthorized){
          this.navigateToSessionTimeout();
        }
      }
    )
  }

  async navigateToSessionTimeout(){
    this.router.navigateByUrl('/session-timeout');
  }

  async updateOrganisationDetails(){
    await lastValueFrom(this.organisationService
      .updateOrganisationDetails(this.cards[1].details)).then(
      response => {
        if(response.status === HttpStatusCode.Created){
          console.log('Organisation detail updated'+response.body);
        }
      }
    )
  }

  async updateAdministrativeContactDetails(){
    await lastValueFrom(this.conatctFormService.updateAdminDetails(this.cards[2].details)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          console.log('Admin details save successfully...'+response.body);
        }
      }
    )
  }

  async updateTechnicalContactDetails(){
    await lastValueFrom(this.conatctFormService.updateTechDetails(this.cards[3].details)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          console.log('Technical details save successfully...'+response.body)
        }
      }
    )
  }

  async updateBillingContactDetails(){
    await lastValueFrom(this.conatctFormService.updateBillDetails(this.cards[4].details)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          console.log('Billing details save successfully...'+response.body)
        }
      }
    )
  }

  async updateNameServers(){
    await lastValueFrom(this.namServerService.updateListNameServer(this.nameDetails)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          console.log('Name Server details saved successfully'+response.body);
        }
      }
    )
  }

  user: any;
  async getLoggedInUserDetails(){
    await lastValueFrom(this.userService.getUserByEmailId(this.userId)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          this.user = response.body;
          this.updateOrganisationIdForUser(this.organisationId);
        }
      }, error => {
        if(error.status === HttpStatusCode.Unauthorized){
          this.navigateToSessionTimeout();
        }
      }
    )
  }

  async updateUserOnboradingStatus(){
    this.user.isOnboardingCompleted = true;
    await lastValueFrom(this.userService.updateUser(this.user)).then(
      response => {
        if(response.status === HttpStatusCode.PartialContent){
          console.log(this.user);
        }
      }, error => {
        if(error.status === HttpStatusCode.Unauthorized){
          this.navigateToSessionTimeout();
        }
      }
    )
  }

  async updatePreviewDetails(){
   
    await this.getLoggedInUserDetails();
    await this.updateUserOnboradingStatus();
    this.updateDomainDetails();
    this.updateOrganisationDetails();
    this.updateAdministrativeContactDetails();
    this.updateTechnicalContactDetails();
    this.updateBillingContactDetails();
    this.updateNameServers();
   
    this.toastr.success('Details updated successfully');
   // if(this.role === 'IDRBTADMIN'){
      this.router.navigateByUrl('/rgnt-domains');
    //}
  }
  async updateOrganisationIdForUser(organisationId: number){
    this.user.organisationId = organisationId;
    await lastValueFrom(this.userService.updateUser(this.user)).then(
        response => {
            if(response.status === HttpStatusCode.PartialContent){
                console.log('org id updated for the user');
            }
        }, error => {
            if(error.status === HttpStatusCode.Unauthorized){
                this.router.navigateByUrl('/session-timeout');
            }
        }
    )
 }
  submissionAttempted=false;
  orgUploadedDocs=localStorage.getItem('orgDoc')?JSON.parse(localStorage.getItem('orgDoc')):[];
  @Input()adminDocDetails=[]
  @Input()techDocDetails =[]
  @Input()billDocDetails =[]
  @Input()orgDocDetails=[]
  @Output() setAdminUploadedDocs = new EventEmitter<any[]>();
  handleRemoveAdminDoc(index: number): void {
    this.submissionAttempted = false;
    this.adminDocDetails.splice(index, 1);
    // localStorage.setItem('admindocs',(JSON.stringify(this.adminDocDetails)))
   // this.setAdminUploadedDocs.emit(this.adminUploadedDocs);
  }
  handleRemovetechDoc(index: number): void {
    this.submissionAttempted = false;
    this.techDocDetails.splice(index, 1);
    // localStorage.setItem('techdocs',(JSON.stringify(this.techUploadedDocs)))
   // this.setAdminUploadedDocs.emit(this.adminUploadedDocs);
  }
  handleRemoveBillDoc(index: number): void {
    this.submissionAttempted = false;
    this.billDocDetails.splice(index, 1);
   // this.setAdminUploadedDocs.emit(this.adminUploadedDocs);
  //  localStorage.setItem('billdocs',(JSON.stringify(this.billUploadedDocs)))
  }
  handleTechValidationChange(isValid: boolean): void {
    console.log('Validation status:', isValid);
  }

  setTechUploadedDocuments(docs: any[]): void {
      this.techDocDetails = docs;
      console.log('Uploaded documents updated:', this.techDocDetails);
  }

  handleAdminValidationChange(isValid: boolean): void {
    console.log('Validation status:', isValid);
  }

  setAdminUploadedDocuments(docs: any[]): void {
    this.adminDocDetails = docs;
    console.log('Uploaded documents updated:', this.adminDocDetails);
  }

  handleBillingValidationChange(isValid: boolean): void {
    console.log('Validation status:', isValid);
  }

  setBillingUploadedDocuments(docs: any[]): void {
    console.log(docs)
    this.billDocDetails = docs;
    console.log('Uploaded documents updated:', this.billDocDetails);
  }
  handleOrganisationValidationChange(isValid: boolean): void {
    console.log('Validation status:', isValid);
}

setOrganisationUploadedDocuments(docs: any[]): void {
    this.orgDocDetails = docs;
    // localStorage.setItem('orgDoc',JSON.stringify(this.organisationUploadedDocs));
    console.log('Uploaded documents updated:', this.orgDocDetails);
}

pdfUrl:any;
imagUrl:any;
preview:string="preview"
onImageViewClick(imageUrl) {
  console.log(imageUrl)
  this.pdfUrl = null
  this.imagUrl = imageUrl
}
onPdfViewClick(pdfUrl) {
  this.imagUrl = null
  this.pdfUrl = pdfUrl
}

toggleModal(): void {
  // const isChecked = (event.target as HTMLInputElement).checked;
  // console.log("jshdfgjk");
  // if (isChecked) {
    this.isLoading = true;
    this.getDscResponse();
    const modalElement = document.getElementById('passwordModal');
    console.log(modalElement)
    // console.log("kauyrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement,{
        backdrop: 'static',  // This ensures that the backdrop is static (clicking outside won't close the modal)
        keyboard: false      // This disables closing the modal with the escape key
      });
    }
     // Show the modal when the checkbox is checked
  // } else {
  //   this.modalInstance.hide(); // Hide the modal when the checkbox is unchecked
  // }
}

closePasswordModal() {
  if (!this.isSigned) {
    const checkbox = document.getElementById('toggleModalCheckbox') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false; // Uncheck the checkbox
    }
  }
  
  this.modalInstance.hide();  // Hide the modal
  this.tokenPassword = '';
  this.passwordErrorMessage = '';
  this.tokens = [];
  this.selectedToken = null;
}
getDscResponse() {
  this.http.get(`${this.dscApi}/dsc/getTokenRequest`).subscribe(
    (response: any) => {
      console.log('Response from first API:', response);
      if (response && response.encryptedData && response.encryptionKeyID) {
        const payload = {
          encryptedRequest: response.encryptedData,
          encryptionKeyID: response.encryptionKeyID
        };
        this.http.post(`${this.embridgeUrl}/DSC/ListToken`, payload).subscribe(
          (secondApiResponse: any) => {
            console.log('Response from second API:', secondApiResponse);
            if (secondApiResponse) {
              const secondApiResponseData = secondApiResponse.responseData;
              this.http.get(`${this.dscApi}/dsc/getTokenList?data=${encodeURIComponent(secondApiResponseData)}`).subscribe(
                  (response: any) => {
                      console.log('Response from third API:', response);
                      if(response.tokenNames != null && response.tokenNames.length != 0){
                        this.tokens = response.tokenNames;
                        this.isLoading = false;
                        this.modalInstance.show();
                        this.toastr.success("Fetched tokens successfully");
                      }
                      else{
                        this.tokens = [];
                        this.isLoading = false;
                        this.toastr.error("Failed to fetch tokens");
                        this.toastr.warning("If DSC token is not inserted, please insert your DSC Token");
                      }
                      console.log('====================================>'+this.selectedToken);
                  },
                  (error) => {
                      console.error('Failed to get valid tokens.', error);
                      this.isLoading = false;
                      this.toastr.warning("If DSC token is not inserted, please insert your DSC Token");
                  }
              );

            }
          },
          (secondApiError) => {
            console.error('Failed to get valid tokens.', secondApiError);
            this.passwordErrorMessage = 'Failed to get valid tokens.';
            this.isLoading = false;
            this.toastr.warning("If DSC token is not inserted, please insert your DSC Token");
          }
        );
      } else {
        this.passwordErrorMessage = 'Failed to get valid tokens.';
        this.isLoading = false;
        this.toastr.warning("If DSC token is not inserted, please insert your DSC Token");
      }
    },
    (error) => {
      console.error('Error occurred while fetching tokens from the first API:', error);
      this.passwordErrorMessage = 'Failed to get encrypted response from "getTokenRequest".';
      this.isLoading = false;
      this.toastr.warning("If DSC token is not inserted, please insert your DSC Token");
    }
  );
}

onTokenSelect(){
  this.isLoading = true;
  console.log('Selected Token:', this.selectedToken);
  this.http.get(`${this.dscApi}/dsc/getCertificateRequest?keyStoreDisplayName=${encodeURIComponent(this.selectedToken)}`).subscribe(
    (response: any) => {
      console.log('Response from first API:', response);
      if (response && response.encryptedData && response.encryptionKeyID) {
        const payload = {
          encryptedRequest: response.encryptedData,
          encryptionKeyID: response.encryptionKeyID
        };
        this.http.post(`${this.embridgeUrl}/DSC/ListCertificate`, payload).subscribe(
          (secondApiResponse: any) => {
            console.log('Response from second API:', secondApiResponse);
            if (secondApiResponse) {
              //const secondApiResponseData = secondApiResponse.responseData;
              const secondApiResponseData = {
                encryptedCertificateData: secondApiResponse.responseData
              };
              this.http.post(`${this.dscApi}/dsc/getCertificateList`, secondApiResponseData).subscribe(
                  (response: any) => {
                      console.log('Response from third API:', response);
                      if(response.certificates != null && response.certificates.length != 0){
                        this.certificates = response.certificates;
                        this.isLoading = false;
                        this.toastr.success("Fetched certificates successfully");
                      }
                      else{
                        this.certificates = [];
                        this.isLoading = false;
                        this.toastr.error("Failed to fetch certificates from token");
                      }
                      console.log(this.certificates);
                  },
                  (error) => {
                      console.error('Error occurred while calling third API:', error);
                      this.isLoading = false;
                  }
              );

            }
          },
          (secondApiError) => {
            console.error('Error occurred while calling the second API:', secondApiError);
            this.passwordErrorMessage = 'Failed to fetch data from the second API.';
            this.isLoading = false;
          }
        );  
      } else {
        this.passwordErrorMessage = 'Failed to get valid tokens from the first API.';
        this.isLoading = false;
      }
    },
    (error) => {
      console.error('Error occurred while fetching tokens from the first API:', error);
      this.passwordErrorMessage = 'Failed to fetch tokens from the first API.';
      this.isLoading = false;
    }
  );
}

onSign(){
  this.isLoading = true;
  console.log('Selected Token:', this.selectedCertificate);
  const signingRequestData = {
    keyId: this.selectedCertificate.keyId,
    keyStoreDisplayName: this.selectedToken,
    keyStorePassPhrase: this.tokenPassword,
    dataType: this.selectedDataType,
    dataToSign: "I " + this.formData.name + ", hereby undertake that I am working with" 
                + this.formData.organisationName + " as" + this.formData.designation 
                + " and I am authorized to sign the legal documents."
  };
  const encodedSigningRequestData = encodeURIComponent(JSON.stringify(signingRequestData));
  this.http.get(`${this.dscApi}/dsc/getSigningRequest?signingRequestData=${encodeURIComponent(encodedSigningRequestData)}`).subscribe(
    (response: any) => {
      console.log('Response from first API:', response);
      if (response && response.encryptedData && response.encryptionKeyID) {
        const payload = {
          encryptedRequest: response.encryptedData,
          encryptionKeyID: response.encryptionKeyID
        };
        this.http.post(`${this.embridgeUrl}/DSC/PKCSSign`, payload).subscribe(
          (secondApiResponseee: any) => {
            console.log('Response from secondddddd API:', secondApiResponseee);
            if (secondApiResponseee) {
              const secondApiResponseData = {
                encryptedSignedData: secondApiResponseee.responseData
              };
              console.log('==========================>   '+secondApiResponseee);
              this.http.post(`${this.dscApi}/dsc/getSignedResponse`, secondApiResponseData).subscribe(
                  (response: any) => {
                      this.enable=false;
                      this.isSigned=true
                      this.closePasswordModal();
                      console.log('Response from third API:', response);
                      this.isLoading = false;
                      console.log(response);
                      this.toastr.success("Signed using DSC successfully");
                  },
                  (error) => {
                      console.error('Error occurred while calling third API:', error);
                      this.isLoading = false;
                      this.toastr.error("Failed to sign data");
                      this.toastr.warning("Make sure the password entered was right");
                  }
              );

            }
          },
          (secondApiError) => {
            console.error('Error occurred while calling the second API:', secondApiError);
            this.passwordErrorMessage = 'Failed to fetch data from the second API.';
            this.isLoading = false;
          }
        );
      } else {
        this.passwordErrorMessage = 'Failed to get valid tokens from the first API.';
        this.isLoading = false;
      }
    },
    (error) => {
      console.error('Error occurred while fetching tokens from the first API:', error);
      this.passwordErrorMessage = 'Failed to fetch tokens from the first API.';
      this.isLoading = false;
    }
  );
}
isDisabled: boolean = true; 
// this.enable=false;
// this.isSigned=true
// dataToSign: "I " + this.formData.name + ", hereby undertake that I am working with" 
//                 + this.formData.organisationName + " as" + this.formData.designation 
//                 + " and I am authorized to sign the legal documents."

}