import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root', // This makes the service available app-wide
  })
export class DomainObject{

    private domainSubject = new Subject<any>();
    domain$ = this.domainSubject.asObservable();  // Observable to subscribe to

     // Method to set or update the domain
  setDomain(domain: any) {
    this.domainSubject.next(domain);
  }

}