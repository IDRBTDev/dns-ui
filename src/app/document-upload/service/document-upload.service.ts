import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentUploadService {
  private apiUrl = environment.apiURL+'/dr/documents/documentUpload';
  private fetchDocUrl = environment.apiURL+'/dr/documents/orgDocs';
   private updateDocStatusUrl = environment.apiURL+'/dr/documents/updateorgDocs'
   private updateOrgDocsUrl = environment.apiURL+'/dr/documents/updateOrgDocs';
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
    userMailId: string,
    organisationId: number
  ): Observable<string> {
    const formData = new FormData();

    // Append document details to the formData
    uploadedDocs.forEach((doc) => {
      formData.append('files', doc.fileName); // Files
      formData.append('types', doc.type); // Document type
      formData.append('values', doc.value); // Additional document value
      formData.append('file',doc.file);
      formData.append('organisationId', organisationId.toString());
      formData.append('contactType', doc.contactType);
    });

    // Append other required fields
    formData.append('applicationId', applicationId);
    formData.append('user', user);
    formData.append('userMailId', userMailId);
    console.log(formData.getAll("files"))
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
  uploadContactDocuments(
    uploadedDocs: any[],
    applicationId: string,
    user: string,
    userMailId: string
  ): Observable<string> {
    const formData = new FormData();

    // Append document details to the formData
    uploadedDocs.forEach((doc) => {
      formData.append('files', doc.fileName); // Files
      formData.append('types', doc.type); // Document type
      formData.append('values', doc.value); // Additional document value
      formData.append('file',doc.file);
      formData.append('organisationId', doc.organisationId);
      formData.append('contactType', doc.contactType);
    });

    // Append other required fields
    formData.append('applicationId', applicationId);
    formData.append('user', user);
    formData.append('userMailId', userMailId);
    console.log(formData.getAll("files"))
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

  getOrgDoucumentsById(OrgId: number) {
   
    return this.http.get<any>(`${this.fetchDocUrl}/${OrgId}`, {
        
        observe: 'response', headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
      })
    });
}

approveOrRejectOrgDocs(docType,status,orgId): Observable<any> {
   console.log(status)
   return this.http.post<any>(`${this.updateDocStatusUrl}/${orgId}/${docType}`, status, { // Add the options object here
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    })
})
}
// updateOrgDocs(fileObj,docType){
//   return this.http.put<any>(`${this.apiUrl}/${fileObj.organisationId}`,docType,{
//     headers: new HttpHeaders({
//       'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
//     })
//   })
// }
updateOrgDocs(files, docType: string) {
  const formData = new FormData();
  const organisationId=files.organisationId;
  console.log("in service",files.file)
  formData.append('file', files.file, files.file.name); // Append the file

  // Add other parameters as needed (docType in this case)
  formData.append('docType', docType);  // Or formData.append('docType', JSON.stringify(docType)) if docType is an object
  formData.append('value',files.value)
  // If you need to send the organisationId as part of the URL path:
  const url = `${this.updateOrgDocsUrl}/${organisationId}`;

  // Or, if you need to send the organisationId as a query parameter:
  // let params = new HttpParams().set('organisationId', organisationId);
  // const url = `${this.apiUrl}`;

  return this.http.put<any>(url, formData, {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    }),
      // Very important:  Do NOT set the Content-Type header for FormData!
      // The browser will automatically set the correct multipart/form-data
      // boundary if you omit it.  Setting it manually is almost always wrong.
      // Content-Type: 'multipart/form-data'  <-- REMOVE THIS!
    })
  }
}
