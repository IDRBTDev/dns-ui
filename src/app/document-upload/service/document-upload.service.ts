import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentUploadService {
  private apiUrl = environment.apiURL+'/dr/documents/documentUpload';

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
      .post(this.apiUrl, formData, { responseType: 'text' }) // Specify response type as text
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
      .post(this.apiUrl, formData, { responseType: 'text' }) // Specify response type as text
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
}