import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactDocumentUploadService {
  private apiUrl = environment.apiURL+'/dr/contactDocuments/contactDocumentUpload';

  constructor(private http: HttpClient) {}

  /**
   * Upload documents to the server
   * @param uploadedDocs - Array of documents with file, type, and value
   * @param applicationId - Application ID
   * @param user - User name
   * @param userMailId - User email
   * @returns Observable with the server response
   */
  uploadDocuments(
    uploadedDocs: any[],
    applicationId: string,
    user: string,
    userMailId: string
  ): Observable<string> {
    const formData = new FormData();
console.log("conytactservice called")
    // Append document details to the formData
    uploadedDocs.forEach((doc) => {
      formData.append('files', doc.fileName); // Files
      formData.append('types', doc.type); // Document type
      formData.append('values', doc.value); // Additional document value
      formData.append('file',doc.file)
      formData.append('organisationId', doc.organisationId);
      formData.append('contactType', doc.contactType);
    });

    // Append other required fields
    formData.append('applicationId', applicationId);
    formData.append('user', user);
    formData.append('userMailId', userMailId);

    // Make the HTTP POST request
    return this.http
      .post(this.apiUrl, formData, { responseType: 'text' , headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    })}) // Specify response type as text
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Handle errors
          console.error('Error occurred during document upload:', error);
          return throwError(
            error.error || 'An error occurred while uploading documents.'
          );
        })
      );
  }

  getContactOfficerDocuments(contactType: string, organisationId: number){
    const apiUrl  = environment.apiURL+'/dr/contactDocuments/contactOfficerDocuments/'+contactType+'/'+organisationId;
    return this.http.get<any[]>(apiUrl,{observe: 'response', headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
  })});
  }

  updateDocumentStatus(
    approvalStatus: string,
    currentDocumentId: number,
    organisationId: number,
    contactType: string,
    documentType: string,
    comment: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('currentDocumentId', currentDocumentId.toString())
      .set('organisationId', organisationId.toString())
      .set('contactType', contactType)
      .set('documentType', documentType)
      .set('comment', comment);
  
    return this.http.get(
      environment.apiURL+`/dr/contactDocuments/updateDocumentStatus/${approvalStatus}`,
      { params: params, observe: 'response', headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    }) }
    );
  }
  
  getDocStatusOfOfficers(
    organisationId: number
  ): Observable<any> {
    return this.http.get(
      environment.apiURL+`/dr/contactDocuments/documentStatus/${organisationId}`,
      {observe: 'response', headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    }) }
    );
  }
  updateContactDocument(docId, file: File, docType: string) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('docId', docId.toString()); // Convert docId to string
    formData.append('docType', docType);
  
    const apiUrl = environment.apiURL + '/dr/contactDocuments/updateContactDocumentUpload';
  
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    });

    return this.http.post<any>(apiUrl, formData, { headers });
  }

}