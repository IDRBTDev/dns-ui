import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { DomainService } from '../domain/service/domain.service';
import { lastValueFrom } from 'rxjs';
import { NameServerService } from '../name-server-form/service/name-server.service';
import { ContactDetailsFormService } from '../contact-details-form/service/contact-details-form.service';
import { Router } from '@angular/router';
import { OrganisationDetailsService } from '../organisation-details/service/organisation-details.service';
import { ToastrService } from 'ngx-toastr';

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
        bankName: '',

        domainName: '',

        numberOfYears: '',

        cost: '',

        isEditing: false,
      },
    },

    {
      heading: 'Organisation Details',

      details: {
        organisationDetailsId: 0,
        institutionName: '',

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

        adminDocuments: '',

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

        techDocuments: '',

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

        billDocuments: '',

        isEditing: false,
      },
    },

    {
      heading: 'Name Server Details',

      details: {
        nameServerId:0,
        hostName: '',

        ipAddress: '',

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
    private toastr: ToastrService
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
  }

  // Inside the PreviewComponent

  fetchDataFromAPIs() {
    this.http.get<any>('http://localhost:9002/dr/domain/getDetails/'+this.domainId).subscribe({
      next: response => {
        this.cards[0].details.bankName = response.bankName;
        this.cards[0].details.domainId = response.domainId;
        this.cards[0].details.domainName = response.domainName;
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
          this.cards[1].details.institutionName = data.institutionName;
          this.cards[1].details.pincode = data.pincode;
          this.cards[1].details.city = data.city;
          this.cards[1].details.state = data.state;
          this.cards[1].details.address = data.address;
          this.cards[1].details.stdTelephone = data.stdTelephone;
          this.cards[1].details.mobileNumber = data.mobileNumber;
          this.cards[1].details.organisationEmail = data.organisationEmail;
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
          this.cards[2].details.administrativeContactId = data.administrativeContactId
          this.cards[2].details.adminFullName = data.adminFullName;
          this.cards[2].details.adminEmail = data.adminEmail;
          this.cards[2].details.adminPhone = data.adminPhone;
          this.cards[2].details.adminAltPhone = data.adminAltPhone;
          this.cards[2].details.adminDesignation = data.adminDesignation;
          this.cards[2].details.adminDocuments = data.documents;
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
          this.cards[4].details.organisationDetailsId = data.organisationalContactId;
          this.cards[4].details.billFullName = data.billFullName;
          this.cards[4].details.billEmail = data.billEmail;
          this.cards[4].details.billPhone = data.billPhone;
          this.cards[4].details.billAltPhone = data.billAltPhone;
          this.cards[4].details.billDocuments = data.documents;
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
        },
        error: (error) =>
          console.error('Error fetching name server details:', error),
      });
      console.log(this.cards)
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
        console.log(response)
        if(response.status === HttpStatusCode.Ok){
          this.cards[0].details.domainName = response.body.domainName;
          this.cards[0].details.bankName = response.body.bankName;
          this.cards[0].details.numberOfYears = response.body.numberOfYears;
          this.cards[0].details.cost = response.body.cost;
      }
    }
    )
  }

  async updateDomainDetails(){
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
    await lastValueFrom(this.organisationService.updateOrganisationDetails(this.cards[1].details)).then(
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
    await lastValueFrom(this.namServerService.updateNameServer(this.cards[5].details.nameServerId,this.cards[5].details)).then(
      response => {
        if(response.status === HttpStatusCode.Ok){
          console.log('Name Server details saved successfully'+response.body)
        }
      }
    )
  }

  async updatePreviewDetails(){
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
