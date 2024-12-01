import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { NameServerService } from './service/name-server.service';
import { Router } from '@angular/router';

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
  ) {
<<<<<<< HEAD

    if(this.organisationId < 1){
      this.organisationId = this.router.getCurrentNavigation().extras?.state['organisationId'];
    }
    if(this.applicationId != ''){
      this.applicationId = this.router.getCurrentNavigation().extras?.state['applicationId'];
    }
    if(this.domainId < 1){
      this.domainId = this.router.getCurrentNavigation().extras?.state['domainId'];
    }
=======
    this.organisationId =
      this.router.getCurrentNavigation().extras?.state['organisationId'] | 0;
    this.applicationId =
      this.router.getCurrentNavigation().extras?.state['applicationId'];
>>>>>>> 0d7191cf756d5a64856f9f4823a81c4ba32cfb83

    this.nameServerForm = this.fb.group({
      hasNSDetails: ['yes', Validators.required],

      nameServers: this.fb.array([]),
    });

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
            /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
          ),
        ],
      ],
    });
  }

  addNameServer(): void {
    this.nameServers.push(this.createNameServer());
  }

  clearAllNameServers(): void {
    while (this.nameServers.length !== 0) {
      this.nameServers.removeAt(0);
    }
  }

  removeLastNameServer(): void {
    if (this.nameServers.length > 1) {
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
      if(this.formSubmitted.emit() != null){
        this.formSubmitted.emit();
      }else{
        this.router.navigateByUrl('/domains');
      }

      console.log(formData);

      this.nameServerService.addNameServer(formData).subscribe(
        (response) => {
          alert('Form submitted successfully!');

          console.log(response);
        },

        (error) => {
          //alert('Failed to submit form.');

          console.error('Error submitting form:', error);
        }
      );
    }
  }
}
