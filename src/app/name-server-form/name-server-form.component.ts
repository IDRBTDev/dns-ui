import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

import { NameServerService } from './service/name-server.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DomainService } from '../rgnt-domain/service/domain.service';
import { Domain } from '../model/domain.model';
import { error } from 'jquery';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-name-server-form',

  templateUrl: './name-server-form.component.html',

  styleUrls: ['./name-server-form.component.css'],
})
export class NameServerFormComponent implements OnInit {
  @Input() applicationId: string = '';
  @Input() domainId: number = 0;
  @Input() organisationId: number = 0;
  @Input() nameServerLength:number=0;
  @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() back: EventEmitter<void> = new EventEmitter<void>(); // Emit event after form submission

  nameServerForm: FormGroup;

  hasNSDetails: boolean = true;
  

  constructor(
    private fb: FormBuilder,
    private nameServerService: NameServerService,
    private router: Router,
    private toastr: ToastrService,
    private domainService:DomainService
  ) {

    if(this.organisationId < 1){
      this.organisationId = this.router.getCurrentNavigation().extras?.state['organisationId'];
    }
    if(this.applicationId != ''){
      this.applicationId = this.router.getCurrentNavigation().extras?.state['applicationId'];
    }
    if(this.domainId < 1){
      this.domainId = this.router.getCurrentNavigation().extras?.state['domainId'];
    }


    this.nameServerForm = this.fb.group({
      hasNSDetails: ['yes', Validators.required],

      nameServers: this.fb.array([]),
    });

    this.addNameServer();
    this.addNameServer();
  }

  ngOnInit(): void {
    console.log(this.domainId);
    console.log(this.applicationId);
    this.fetchThePriceDetails();
    this.getDomainDetails();
    this.nameServerForm.get('hasNSDetails')?.valueChanges.subscribe((value) => {
      this.hasNSDetails = value === 'yes';

      if (this.hasNSDetails && this.nameServers.length === 0) {
        this.addNameServer();
      } else if (!this.hasNSDetails) {
        this.clearAllNameServers();
      }
    });
  }

  domain:Domain= new Domain();
  getDomainDetails(){
    this.domainService.getDomainByDomainId(this.domainId).subscribe({
      next:(response)=>{
        this.domain=response.body;
      },error:(error)=>{
        if(error.status===HttpStatusCode.Unauthorized){
          this.navigateToSessionTimeOut();
        }
      }
    })
  }
  navigateToSessionTimeOut(){
    this.router.navigateByUrl("/session-timeout")
  }
  get nameServers(): FormArray {
    return this.nameServerForm.get('nameServers') as FormArray;
  }

  createNameServer(): FormGroup {
    return this.fb.group({
      organisationId: this.organisationId,
      applicationId: this.applicationId,
      domainId: this.domainId,
      userMailId: localStorage.getItem('email'),

         hostName: [
        '',
        [
          Validators.required,
          this.uniqueHostNameValidator.bind(this) // Apply the custom validator here
        ]
      ],
       ipAddress: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/
          ),
          this.uniqueIpAddressValidator.bind(this),
        ]
      ]
      
    });
  }
  
 // Updated Unique IP Address Validator
uniqueIpAddressValidator(control: AbstractControl): ValidationErrors | null {
  const ipAddress = control.value;

  // Check if there's any IP address in the form that matches the current one
  const duplicate = this.nameServers.controls.some((server: FormGroup) => {
    // Skip the current form group to avoid comparing the IP address with itself
    return server.get('ipAddress')?.value === ipAddress && server !== control.parent;
  });

  // Return error if duplicate is found
  if (duplicate) {
    return { duplicateIpAddress: true };
  }

  return null; // No duplicates found
}

uniqueHostNameValidator(control: AbstractControl): ValidationErrors | null {
  const hostName = control.value;

  // Check if there's any IP address in the form that matches the current one
  const duplicate = this.nameServers.controls.some((server: FormGroup) => {
    // Skip the current form group to avoid comparing the IP address with itself
    return server.get('hostName')?.value === hostName && server !== control.parent;
  });

  // Return error if duplicate is found
  if (duplicate) {
    return { duplicateHostName: true };
  }

  return null; // No duplicates found
}


price:number
addNameServer(): void {
  
  this.nameServers.push(this.createNameServer());
  console.log(this.nameServers.length)
  if(this.nameServers?.length+this.nameServerLength>2){
    //  this.fetchThePriceDetails();
    this.price=this.getPriceByNsRecordCount(this.nameServers?.length+this.nameServerLength);
   
    console.log(this.price,this.domainId);
  }
}

  removeLastNameServer(): void {
    if (this.nameServers.length > 2) {
      this.nameServers.removeAt(this.nameServers.length - 1);
    }
  }
  updatePrice(){
    if(this.nameServers?.length+this.nameServerLength>0){
      //  this.fetchThePriceDetails();
      this.price=this.getPriceByNsRecordCount(this.nameServers.length+this.nameServerLength);
     
      console.log(this.price,this.domainId);
    }
  }
  
  clearAllNameServers(): void {
    while (this.nameServers.length > 2) { 
      this.nameServers.removeAt(this.nameServers.length - 1);
    }
  }

  goBack(): void {
    this.back.emit();
  }
  errorMessage='';
  onSubmit(): void {
    if (this.nameServerForm.invalid) {
      this.nameServerForm.markAllAsTouched();

      // alert('Please fill all required fields.');
    } else {
      const formData = {
        nameServers: this.nameServerForm.value.nameServers,
      };
      // Wrap in expected format
      //if(this.formSubmitted.emit() != null){
      //}else{
      //  this.router.navigateByUrl('/domains');
      //}

      console.log(formData);

      this.nameServerService.addNameServer(formData).subscribe(
        (response) => {
          console.log(response);
          if(response != null){
            this.formSubmitted.emit();
            this.toastr.success("Address is Valid");
            this.domain.cost=this.price;
            this.updatePriceForDomain(this.domain);
            if(this.nameServerLength>0){
              this.router.navigateByUrl("/domain-details?domainId="+this.domainId);
            }
            // this.router.navigateByUrl("/rgnt-domains");
          }
        },

        (error) => {
          //alert('Failed to submit form.');
        this.toastr.error("Address is Reserved")
          console.error('Error submitting form:', error);
        }
      );
    }
  }
  
  updatePriceForDomain(domain){
    this.domainService.updateDomainDetails(domain).subscribe({
      next:(response)=>{
        console.log("price updated successfully")
      },error:(error)=>{
        if(error.status===HttpStatusCode.Unauthorized){
          this.router.navigateByUrl("/session-timeout")
        }
      }
    })
  }

  getPriceByNsRecordCount(nsRecordCount: number): number | null {
    const sortedData = [...this.priceDetails].sort((a, b) => a.nsRecordCount - b.nsRecordCount);

    // Find the closest matching or the highest nsRecordCount
    let closestMatch = null;
    for (const item of sortedData) {
      if (item.nsRecordCount >= nsRecordCount) {
        closestMatch = item;
        break; // Stop iterating once a match or higher value is found
      }
    }

    // If no match or higher value is found, use the highest available nsRecordCount
    if (!closestMatch) {
      closestMatch = sortedData[sortedData.length - 1]; 
    }

    return closestMatch ? closestMatch.price : null;
  }
  priceDetails
  fetchThePriceDetails(){
    this.domainService.getAllPriceDetails().subscribe({
      next:(response)=>{
        console.log(response.body)
        this.priceDetails=response.body;
        console.log(this.nameServers)
        if(this.nameServers.length+this.nameServerLength>0){
        this.updatePrice()
        }
      },error:(error)=>{
        // console.log(error)
      }
    })
  }
}
