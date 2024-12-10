import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  tokenPassword = '';
  validationError = '';
  passwordErrorMessage = '';
  isPasswordModalOpen = false;
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
  dscApi = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  openPasswordModal() {
    if (!this.formData.agree) {
      this.validationError = 'You must agree to the terms and conditions.';
      return;
    }
    this.validationError = '';
    this.getDscResponse();
    this.isPasswordModalOpen = true;
  }

  closePasswordModal() {
    this.isPasswordModalOpen = false;
    this.tokenPassword = '';
    this.passwordErrorMessage = '';
    this.tokens = [];
    this.selectedToken = null;
  }

  getDscResponse() {
    // First API call to get the response (encryptedData and encryptionKeyID)
    this.http.get(`${this.dscApi}/dsc/getTokenRequest`).subscribe(
      //DSC/ListToken
      (response: any) => {
        console.log('Response from first API:', response);

        // Check if the response contains encryptedData and encryptionKeyID
        if (response && response.encryptedData && response.encryptionKeyID) {
          // Construct the payload for the second API call
          const payload = {
            encryptedRequest: response.encryptedData,
            encryptionKeyID: response.encryptionKeyID
          };

          // Second API call (POST request) to pass the payload
          this.http.post(`${this.embridgeUrl}/DSC/ListToken`, payload).subscribe(
            (secondApiResponse: any) => {
              console.log('Response from second API:', secondApiResponse);
              // Handle second API response
              if (secondApiResponse) {
                // Store the result or use it as needed
                // this.tokens = secondApiResponse.tokens || [];
                // Convert secondApiResponse object to a query-friendly string (JSON string)
                const secondApiResponseData = secondApiResponse.responseData;
                this.http.get(`${this.dscApi}/dsc/getTokenList?data=${encodeURIComponent(secondApiResponseData)}`).subscribe(
                    (response: any) => {
                        console.log('Response from third API:', response);
                        this.tokens = response.tokenNames || [];
                        console.log('====================================>'+this.selectedToken);
                    },
                    (error) => {
                        console.error('Error occurred while calling third API:', error);
                    }
                );

              }
            },
            (secondApiError) => {
              console.error('Error occurred while calling the second API:', secondApiError);
              this.passwordErrorMessage = 'Failed to fetch data from the second API.';
            }
          );
        } else {
          this.passwordErrorMessage = 'Failed to get valid tokens from the first API.';
        }
      },
      (error) => {
        console.error('Error occurred while fetching tokens from the first API:', error);
        this.passwordErrorMessage = 'Failed to fetch tokens from the first API.';
      }
    );
  }
  

  // getTokens() {
  //   this.http.get(`${this.embridgeUrl}/DSC/ListToken`).subscribe(
  //     (response: any) => {
  //       this.tokens = response.tokens || [];
  //       if (this.tokens.length === 0) {
  //         this.passwordErrorMessage = 'No DSC tokens found.';
  //       }
  //     },
  //     (error) => {
  //       this.passwordErrorMessage = 'Failed to fetch tokens.';
  //     }
  //   );
  // }

  onTokenSelect(){
    console.log('Selected Token:', this.selectedToken);
    // this.http.get(`${this.dscApi}/dsc/getCertificateRequest?keyStoreDisplayName=${encodeURIComponent(this.selectedToken)}`).subscribe(
    //   (response: any) => {
    //   console.log('Response from third API:', response);
    //   this.tokens = response.tokenNames || [];
    //   console.log(this.selectedToken);
    // },
    //   (error) => {
    //     console.error('Error occurred while calling third API:', error);
    //   }
    // );
    this.http.get(`${this.dscApi}/dsc/getCertificateRequest?keyStoreDisplayName=${encodeURIComponent(this.selectedToken)}`).subscribe(
      //DSC/ListToken
      (response: any) => {
        console.log('Response from first API:', response);

        // Check if the response contains encryptedData and encryptionKeyID
        if (response && response.encryptedData && response.encryptionKeyID) {
          // Construct the payload for the second API call
          const payload = {
            encryptedRequest: response.encryptedData,
            encryptionKeyID: response.encryptionKeyID
          };

          // Second API call (POST request) to pass the payload
          this.http.post(`${this.embridgeUrl}/DSC/ListCertificate`, payload).subscribe(
            (secondApiResponse: any) => {
              console.log('Response from second API:', secondApiResponse);
              // Handle second API response
              if (secondApiResponse) {
                // Store the result or use it as needed
                // this.tokens = secondApiResponse.tokens || [];
                // Convert secondApiResponse object to a query-friendly string (JSON string)
                const secondApiResponseData = secondApiResponse.responseData;
                this.http.get(`${this.dscApi}/dsc/getCertificateList?data=${encodeURIComponent(secondApiResponseData)}`).subscribe(
                    (response: any) => {
                        console.log('Response from third API:', response);
                        this.certificates = response.certificates || [];
                        console.log(this.certificates);
                    },
                    (error) => {
                        console.error('Error occurred while calling third API:', error);
                    }
                );

              }
            },
            (secondApiError) => {
              console.error('Error occurred while calling the second API:', secondApiError);
              this.passwordErrorMessage = 'Failed to fetch data from the second API.';
            }
          );  
        } else {
          this.passwordErrorMessage = 'Failed to get valid tokens from the first API.';
        }
      },
      (error) => {
        console.error('Error occurred while fetching tokens from the first API:', error);
        this.passwordErrorMessage = 'Failed to fetch tokens from the first API.';
      }
    );
  }

  onSubmit(){
    console.log('Selected Token:', this.selectedCertificate);
    // this.http.get(`${this.dscApi}/dsc/getCertificateRequest?keyStoreDisplayName=${encodeURIComponent(this.selectedToken)}`).subscribe(
    //   (response: any) => {
    //   console.log('Response from third API:', response);
    //   this.tokens = response.tokenNames || [];
    //   console.log(this.selectedToken);
    // },
    //   (error) => {
    //     console.error('Error occurred while calling third API:', error);
    //   }
    // );
    const declarationData = {
      ...this.formData,
      token: this.selectedToken,
      certificateKeyId: this.selectedCertificate,
      dataType: this.selectedDataType
    };
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
      //DSC/ListToken
      (response: any) => {
        console.log('Response from first API:', response);

        // Check if the response contains encryptedData and encryptionKeyID
        if (response && response.encryptedData && response.encryptionKeyID) {
          // Construct the payload for the second API call
          const payload = {
            encryptedRequest: response.encryptedData,
            encryptionKeyID: response.encryptionKeyID
          };

          // Second API call (POST request) to pass the payload
          this.http.post(`${this.embridgeUrl}/DSC/PKCSSign`, payload).subscribe(
            (secondApiResponseee: any) => {
              console.log('Response from secondddddd API:', secondApiResponseee);
              // Handle second API response
              if (secondApiResponseee) {
                // Store the result or use it as needed
                // this.tokens = secondApiResponse.tokens || [];
                // Convert secondApiResponse object to a query-friendly string (JSON string)
                const encryptedSignedData = secondApiResponseee.responseData;
                const secondApiResponseData = {
                  encryptedSignedData: secondApiResponseee.responseData
                };
                console.log('==========================>   '+secondApiResponseee);
                const encodedSecondApiResponseData = encodeURIComponent(JSON.stringify(secondApiResponseData));
                this.http.post(`${this.dscApi}/dsc/getSignedResponse`, secondApiResponseData).subscribe(
                    (response: any) => {
                        console.log('Response from third API:', response);
                        //this.certificates = response.certificates || [];
                        console.log(response);
                    },
                    (error) => {
                        console.error('Error occurred while calling third API:', error);
                    }
                );

              }
            },
            (secondApiError) => {
              console.error('Error occurred while calling the second API:', secondApiError);
              this.passwordErrorMessage = 'Failed to fetch data from the second API.';
            }
          );
        } else {
          this.passwordErrorMessage = 'Failed to get valid tokens from the first API.';
        }
      },
      (error) => {
        console.error('Error occurred while fetching tokens from the first API:', error);
        this.passwordErrorMessage = 'Failed to fetch tokens from the first API.';
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
}













//http://172.27.20.69.emudra.com:26769