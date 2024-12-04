import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { DomainService } from '../domain/service/domain.service';
import { lastValueFrom } from 'rxjs';
import { NameServerService } from '../name-server-form/service/name-server.service';
import { ContactDetailsFormService } from '../contact-details-form/service/contact-details-form.service';
import { Router } from '@angular/router';
import { OrganisationDetailsService } from '../organisation-details/service/organisation-details.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user/service/user.service';

@Component({
  selector: 'app-preview',

  templateUrl: './preview.component.html',

  styleUrls: ['./preview.component.css'],
})
export class PreviewComponent implements OnInit, OnChanges {
  @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() back: EventEmitter<void> = new EventEmitter<void>(); // Emit event after form submission

  @Input() organisationId: number = 0;
  @Input() domainId: number = 0;

  userId: string = localStorage.getItem('email');
  role: string = localStorage.getItem('userRole');

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

  ngOnInit(): void {
    this.fetchDataFromAPIs();
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
        organisationId:this.organisationId,
        adminDocuments: '',
        applicationId:0,
        userMailId:'',
        city:'',
        pincode:'',
        state:'',
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
        applicationId:0,
        userMailId:'',
        techDocuments: '',
        organisationId:this.organisationId,
        city:'',
        pincode:'',
        state:'',
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
        billDesignation:'',
        billDocuments: '',
        applicationId:0,
        userMailId:'',
        organisationId:this.organisationId,
        city:'',
        pincode:'',
        state:'',
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
    private userService: UserService
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
  }

  // Inside the PreviewComponent

  fetchDataFromAPIs() {
    this.http.get<any>('http://localhost:9002/dr/domain/getDetails/'+this.domainId).subscribe({
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
        'http://localhost:9002/dr/organisationDetails/getDetailsById/'+this.organisationId
      )
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
        },
        error: (error) =>
          console.error('Error fetching organisation details:', error),
      });

    // Fetch Administrative Contact using getDetailsById
    this.http
      .get<any>(
        'http://localhost:9002/dr/administrativeContact/get/'+this.organisationId
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
          this.cards[2].details.adminDocuments = data.documents;
          this.cards[2].details.organisationId= this.organisationId;
          this.cards[2].details.userMailId = data.userMailId;
          this.cards[2].details.userName = data.userName;
          this.cards[2].details.city = data.city;
          this.cards[2].details.state = data.state;
          this.cards[2].details.pincode = data.pincode;
          this.cards[2].details.applicationId = data.applicationId;
        },
        error: (error) =>
          console.error('Error fetching admin contact details:', error),
      });

    // Fetch Technical Contact using getDetailsById
    this.http
      .get<any>(
        'http://localhost:9002/dr/technicalContact/get/'+this.organisationId
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
          this.cards[3].details.techDocuments = data.documents;
          this.cards[3].details.organisationId= this.organisationId;
          this.cards[3].details.userMailId = data.userMailId;
          this.cards[3].details.userName = data.userName;
          this.cards[3].details.city = data.city;
          this.cards[3].details.state = data.state;
          this.cards[3].details.pincode = data.pincode;
          this.cards[3].details.applicationId = data.applicationId;
        },
        error: (error) =>
          console.error('Error fetching tech contact details:', error),
      });

    // Fetch Billing Contact using getDetailsById
    this.http
      .get<any>(
        'http://localhost:9002/dr/billingContact/get/'+this.organisationId
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
          this.cards[4].details.billDocuments = data.documents;
          this.cards[4].details.organisationId= this.organisationId;
          this.cards[4].details.userMailId = data.userMailId;
          this.cards[4].details.userName = data.userName;
          this.cards[4].details.city = data.city;
          this.cards[4].details.state = data.state;
          this.cards[4].details.pincode = data.pincode;
          this.cards[4].details.applicationId = data.applicationId;
        },
        error: (error) =>
          console.error('Error fetching billing contact details:', error),
      });

    // Fetch Name Server Details using getDetailsById
    this.http
      .get<any>(
        'http://localhost:9002/dr/nameServer/get/'+this.organisationId
      )
      .subscribe({
        next: (data) => {
          console.log(data)
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
    console.log(this.cards[1].details.institutionName);
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
    await lastValueFrom(this.namServerService.updateNameServer(this.cards[5].details)).then(
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
    this.router.navigateByUrl('/domains');
  }

}