import {
  Component, OnInit, EventEmitter, Output
}
  from '@angular/core';

import {
  FormBuilder, FormGroup,
  FormArray, Validators
}
  from '@angular/forms';

import { NameServerService } from './service/name-server.service';



@Component({

  selector:
    'app-name-server-form',

  templateUrl:
    './name-server-form.component.html',

  styleUrls: ['./name-server-form.component.css']

})

export class
NameServerFormComponent
  implements OnInit {
    @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
    @Output() back: EventEmitter<void> = new EventEmitter<void>(); // Emit event after form submission

  nameServerForm:
    FormGroup;

  hasNSDetails:
    boolean =
    true;



  constructor(private fb: FormBuilder, private nameServerService: NameServerService) {

    this.nameServerForm = this.fb.group({
      hasNSDetails: ['yes', Validators.required],

      nameServers: this.fb.array([]),

    });

    this.addNameServer();

  }



  ngOnInit():void {

    this.nameServerForm.get('hasNSDetails')?.valueChanges.subscribe((value) => {

      this.hasNSDetails
        = value
        === 'yes';

      if (this.hasNSDetails
        && this.nameServers.length
        === 0) {

        this.addNameServer();

      } else
        if (!this.hasNSDetails) {

          this.clearAllNameServers();

        }

    });

  }



  get nameServers():
    FormArray {

    return this.nameServerForm.get('nameServers') as FormArray;

  }



  createNameServer(): FormGroup {

    return this.fb.group({

      hostName: ['',
        Validators.required],

      ipAddress: ['', [

        Validators.required,

        Validators.pattern(/^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)

      ]],

    });

  }



  addNameServer():
    void {

    this.nameServers.push(this.createNameServer());

  }



  clearAllNameServers():
    void {

    while (this.nameServers.length
      !== 0) {

      this.nameServers.removeAt(0);

    }

  }



  removeLastNameServer():
    void {

    if (this.nameServers.length
      > 1) {

      this.nameServers.removeAt(this.nameServers.length
        - 1);

    }

  }

  goBack():void{
    
    this.back.emit()
  }

  onSubmit():
    void {

    if (this.nameServerForm.invalid) {

      this.nameServerForm.markAllAsTouched();

      // alert('Please fill all required fields.');



    } else {

      const
        formData = {
          nameServers:
            this.nameServerForm.value.nameServers
        };
      // Wrap in expected format
      this.formSubmitted.emit();

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