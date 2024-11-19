import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomainService } from '../domain/service/domain.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-domain-invoices',
  templateUrl: './domain-invoices.component.html',
  styleUrls: ['./domain-invoices.component.css']
})
export class DomainInvoicesComponent {
  
  displayedColumns: string[] = [
    'checkbox',
    'slno',
    'organisationname',
    'invoiceno',
    'date',
    'amount',
    'duedate',
    'status',
  ]; 

  domainsinvoicesList: any[];
  domainsDataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private domainService: DomainService, private router: Router) {
    this.domainsDataSource = new MatTableDataSource<any>();
  }

}
