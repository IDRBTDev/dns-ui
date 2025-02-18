import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-dsc-verification',
  templateUrl: './dsc-verification.component.html',
  styleUrls: ['./dsc-verification.component.css'],
})
export class DscVerificationComponent {
  formData = {
    name: '',
    fatherName: '',
    age: '',
    organisationName: '',
    designation: '',
    authOrganisationName: '',
    agree: false,
  };
  ageError: boolean = false;
  
  private apiEnvUrl = environment.apiURL

  tokenPassword = '';
  validationError : string = '';
  passwordErrorMessage = '';
  isPasswordModalOpen = false;
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
  // dscApi = 'http://172.27.10.232:9002';
  dscApi = 'http://localhost:9002';


  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) {}
  onAgeInput(event: any) {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, '');
    this.formData.age = numericValue;
    if (parseInt(numericValue) >= 150 || numericValue === '') {
      this.ageError = true;
    } else {
      this.ageError = false;
      
    }
  }
  
  
  
  affixDSC() {
    // if (!this.validateForm()||this.ageError) {
    //   if (!this.formData.agree ) {
    //   this.validationError = 'You must agree to the terms and conditions.';
    //   }
    //   else{
    //     this.validationError = 'You must fill all the details.';
    //   }
    //   return;
    // }
    // this.isLoading = true;
    //this.openPasswordModal();
    // if(!this.isTokenInserted){
    //   this.toastr.warning("Please insert your DSC Token");
    //   this.isLoading = false;
    // }
    // else{
    //   this.openPasswordModal();
    // }
  //  this.getDscResponse();
  //  this.router.navigateByUrl("/rgnt-domains")
   this.router.navigateByUrl("/rgnt-domains")
  }

  openPasswordModal() {
    this.validationError = '';
    this.isPasswordModalOpen = true;
  }

  closePasswordModal() {
    this.isPasswordModalOpen = false;
    this.tokenPassword = '';
    this.passwordErrorMessage = '';
    this.tokens = [];
    this.certificates = [];
    this.dataTypes = [];
    this.selectedCertificate = null;
    this.selectedToken = null;
  }
  validateForm() {
    if (
      !this.formData.name ||
      !this.formData.fatherName ||
      !this.formData.age ||
      !this.formData.organisationName ||
      !this.formData.designation ||
      !this.formData.authOrganisationName ||
      !this.formData.agree
    ) {
      this.validationError = 'Please fill out all the fields and agree to the terms.';
      return false;
    }
    this.validationError = '';
    return true;
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
                          this.openPasswordModal();
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
                          // console.log(response.certificates.certificate.emailAddress);
                          // console.log(localStorage.getItem('email'));
                          // for (let certificate of response.certificates) {
                          //   if(certificate.emailAddress == localStorage.getItem('email')){
                          //     console.log(certificate.emailAddress);
                              this.certificates = response.certificates;
                              this.isLoading = false;
                              this.toastr.success("Fetched certificates successfully");
                          //   }
                          //   else{
                          //     this.isLoading = false;
                          //     this.toastr.error("Mail Id in the certificate and the mail id used for login doesn't match. Please use the certificate generated with same mail id");
                          //   }
                          // }
                          
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

  onSubmit(){
    this.isLoading = true;
    console.log('Selected Token:', this.selectedCertificate);
    const signingRequestData = {
      keyId: this.selectedCertificate.keyId,
      keyStoreDisplayName: this.selectedToken,
      keyStorePassPhrase: this.tokenPassword,
      dataType: this.selectedDataType,
      dataToSign: "I " + this.formData.name + " son/daughter of" + this.formData.fatherName 
                  + " aged" + this.formData.age + " years, hereby undertake that I am working with" 
                  + this.formData.organisationName + " as" + this.formData.designation 
                  + " and I am authorized to sign the legal documents on behalf of " + this.formData.authOrganisationName
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
                        this.closePasswordModal();
                        console.log('Response from third API:', response);
                        this.isLoading = false;
                        console.log(response);
                        this.toastr.success("Signed using DSC successfully");
                        this.router.navigateByUrl('/rgnt-domains');
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

  connectToToken() {
    if (!this.selectedToken || !this.tokenPassword) {
      this.passwordErrorMessage = 'Please select a token and enter the PIN.';
      return;
    }

    const payload = { tokenId: this.selectedToken.id, pin: this.tokenPassword };

    this.http.post(`${this.embridgeUrl}/connect`, payload).subscribe(
      (response: any) => {
        this.retrieveCertificate(this.selectedToken.id);
      },
      (error) => {
        this.passwordErrorMessage = 'Failed to connect to token.';
      }
    );
  }

  retrieveCertificate(tokenId: string) {
    this.http.get(`${this.embridgeUrl}/tokens/${tokenId}/certificate`).subscribe(
      (response: any) => {
        this.certificates = response.certificate;
        this.closePasswordModal();
      },
      (error) => {
        this.passwordErrorMessage = 'Failed to retrieve certificate.';
      }
    );
  }
  preventSpecialChars(event: KeyboardEvent): void {
  const regex = /^[a-zA-Z\s]+$/; // Only allows alphanumeric characters
  const key = event.key;
  if (!regex.test(key)) {
    event.preventDefault(); // Prevent the default behavior if the character is not allowed
  }
}
}













//http://172.27.20.69.emudra.com:26769