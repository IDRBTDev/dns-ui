import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { NameServerService } from './service/name-server.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-name-server-form',

  templateUrl: './name-server-form.component.html',

  styleUrls: ['./name-server-form.component.css'],
})
export class NameServerFormComponent implements OnInit {
  @Input() applicationId: string = '';
  @Input() domainId: number = 0;
  @Input() organisationId: number = 0;
  @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() back: EventEmitter<void> = new EventEmitter<void>(); // Emit event after form submission

  nameServerForm: FormGroup;

  hasNSDetails: boolean = true;
  

  constructor(
    private fb: FormBuilder,
    private nameServerService: NameServerService,
    private router: Router,
    private toastr: ToastrService
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
    this.nameServerForm.get('hasNSDetails')?.valueChanges.subscribe((value) => {
      this.hasNSDetails = value === 'yes';

      if (this.hasNSDetails && this.nameServers.length === 0) {
        this.addNameServer();
      } else if (!this.hasNSDetails) {
        this.clearAllNameServers();
      }
    });
  }

  async getOrganisationDetails(){

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

      hostName: ['', Validators.required],
       ipAddress: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/
          )
        ]
      ]
      
    });
  }

  addNameServer(): void {
    this.nameServers.push(this.createNameServer());
  }

  removeLastNameServer(): void {
    if (this.nameServers.length > 2) {
      this.nameServers.removeAt(this.nameServers.length - 1);
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
            this.toastr.success("Domain added successfully");
            this.router.navigateByUrl("/rgnt-domains");
          }
        },

        (error) => {
          //alert('Failed to submit form.');

          console.error('Error submitting form:', error);
        }
      );
    }
  }
}
