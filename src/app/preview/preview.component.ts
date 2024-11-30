import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
})
export class PreviewComponent implements OnInit {
  @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() back: EventEmitter<void> = new EventEmitter<void>(); // Emit event after form submission

  organisationDetailsId: number | null = null;
  cards = [
    {
      heading: 'Domain Applying For',
      details: {
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
        hostName: '',
        ipAddress: '',
        isEditing: false,
      },
    },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOrganisationDetailsIdFromLocalStorage();
  }

  /**
   * Fetch the organisationDetailsId from localStorage dynamically.
   * If found, trigger API call to get the organisation details.
   */
  fetchOrganisationDetailsIdFromLocalStorage(): void {
    // Retrieve the organisationDetailsId from localStorage dynamically
    const storedId = localStorage.getItem('organisationDetailsId');

    if (storedId) {
      this.organisationDetailsId = +storedId; // Convert string to number
      this.fetchDataFromAPIs();
    } else {
      console.error('No organisationDetailsId found in localStorage');
    }
  }

  /**
   * Fetch data from different APIs and populate card details
   */
  fetchDataFromAPIs() {
    if (this.organisationDetailsId === null) {
      console.error('Organisation Details ID is null');
      return;
    }

    // Fetch Organisation Details using getDetailsById
    this.http
      .get<any>(
        `http://localhost:9010/dr/organisationDetails/get/${this.organisationDetailsId}`
      )
      .subscribe({
        next: (data) => {
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
        `http://localhost:9005/dr/administrativeContact/get/${this.organisationDetailsId}`
      )
      .subscribe({
        next: (data) => {
          this.cards[2].details.adminFullName = data.fullName;
          this.cards[2].details.adminEmail = data.email;
          this.cards[2].details.adminPhone = data.phone;
          this.cards[2].details.adminAltPhone = data.altPhone;
          this.cards[2].details.adminDesignation = data.designation;
          this.cards[2].details.adminDocuments = data.documents;
        },
        error: (error) =>
          console.error('Error fetching admin contact details:', error),
      });

    // Fetch Technical Contact using getDetailsById
    this.http
      .get<any>(
        `http://localhost:9005/dr/technicalContact/get/${this.organisationDetailsId}`
      )
      .subscribe({
        next: (data) => {
          this.cards[3].details.techFullName = data.fullName;
          this.cards[3].details.techEmail = data.email;
          this.cards[3].details.techPhone = data.phone;
          this.cards[3].details.techAltPhone = data.altPhone;
          this.cards[3].details.techDesignation = data.designation;
          this.cards[3].details.techDocuments = data.documents;
        },
        error: (error) =>
          console.error('Error fetching tech contact details:', error),
      });

    // Fetch Billing Contact using getDetailsById
    this.http
      .get<any>(
        `http://localhost:9005/dr/billingContact/get/${this.organisationDetailsId}`
      )
      .subscribe({
        next: (data) => {
          this.cards[4].details.billFullName = data.fullName;
          this.cards[4].details.billEmail = data.email;
          this.cards[4].details.billPhone = data.phone;
          this.cards[4].details.billAltPhone = data.altPhone;
          this.cards[4].details.billDocuments = data.documents;
        },
        error: (error) =>
          console.error('Error fetching billing contact details:', error),
      });

    // Fetch Name Server Details using getDetailsById
    this.http
      .get<any>(
        `http://localhost:9005/dr/nameServer/get/${this.organisationDetailsId}`
      )
      .subscribe({
        next: (data) => {
          this.cards[5].details.hostName = data.hostName;
          this.cards[5].details.ipAddress = data.ipAddress;
        },
        error: (error) =>
          console.error('Error fetching name server details:', error),
      });
  }

  // Go back to previous page or state
  goBack(): void {
    this.back.emit();
  }

  // Emit form submission event
  onSubmit(): void {
    this.formSubmitted.emit();
  }

  // Toggle edit mode for each card
  toggleEdit(card: any) {
    card.details.isEditing = !card.details.isEditing;
  }

  // Save changes for a specific card
  // Save changes for a specific card
  onSave(card: any) {
    console.log(`${card.heading} saved:`, card.details);

    // Disable editing mode after saving
    card.details.isEditing = false;

    // Make API calls to save the updated data to the backend
    switch (card.heading) {
      case 'Organisation Details':
        this.saveOrganisationDetails(card.details);
        break;
      case 'Administrative Contact':
        this.saveAdminContact(card.details);
        break;
      case 'Technical Contact':
        this.saveTechContact(card.details);
        break;
      case 'Billing Contact':
        this.saveBillingContact(card.details);
        break;
      case 'Name Server Details':
        this.saveNameServerDetails(card.details);
        break;
      default:
        console.log('No save action for this section.');
    }
  }

  // Save Organisation Details
  saveOrganisationDetails(details: any) {
    this.http
      .put<any>(
        `http://localhost:9010/dr/organisationDetails/update/${this.organisationDetailsId}`,
        details
      )
      .subscribe({
        next: (response) => {
          console.log('Organisation details updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating organisation details:', error);
        },
      });
  }

  // Save Administrative Contact
  saveAdminContact(details: any) {
    this.http
      .put<any>(
        `http://localhost:9005/dr/administrativeContact/update/${this.organisationDetailsId}`,
        details
      )
      .subscribe({
        next: (response) => {
          console.log('Administrative contact updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating administrative contact:', error);
        },
      });
  }

  // Save Technical Contact
  saveTechContact(details: any) {
    this.http
      .put<any>(
        `http://localhost:9005/dr/technicalContact/update/${this.organisationDetailsId}`,
        details
      )
      .subscribe({
        next: (response) => {
          console.log('Technical contact updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating technical contact:', error);
        },
      });
  }

  // Save Billing Contact
  saveBillingContact(details: any) {
    this.http
      .put<any>(
        `http://localhost:9005/dr/billingContact/update/${this.organisationDetailsId}`,
        details
      )
      .subscribe({
        next: (response) => {
          console.log('Billing contact updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating billing contact:', error);
        },
      });
  }

  // Save Name Server Details
  saveNameServerDetails(details: any) {
    this.http
      .put<any>(
        `http://localhost:9005/dr/nameServer/update/${this.organisationDetailsId}`,
        details
      )
      .subscribe({
        next: (response) => {
          console.log('Name server details updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating name server details:', error);
        },
      });
  }

  // Cancel changes for a specific card
  onCancel(card: any) {
    // Reset to original state (could use original data if needed)
    card.details.isEditing = false;
    console.log(`${card.heading} changes canceled.`);
  }
}
