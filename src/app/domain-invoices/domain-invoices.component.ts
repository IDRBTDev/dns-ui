import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomainService } from '../domain/service/domain.service';
import { Router } from '@angular/router';
import { DomainInvoices } from '../model/domain-invoices.model';
import { DomainInvoiceService } from './service/domain-invoices.service';

@Component({
  selector: 'app-domain-invoices',
  templateUrl: './domain-invoices.component.html',
  styleUrls: ['./domain-invoices.component.css']
})
export class DomainInvoicesComponent implements OnInit {
  
  displayedColumns: string[] = [
    'checkbox',
    'billingId',
    'organisationname',
    'invoiceNumber',
    'invoiceDate',
    'amount',
    'duedate',
    'status',
  ]; 

  domainsinvoicesList: DomainInvoices[] = [];
  domainsDataSource: MatTableDataSource<DomainInvoices>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private domainService: DomainService, private router: Router, private domainInvoiceService: DomainInvoiceService) {
    this.domainsDataSource = new MatTableDataSource<DomainInvoices>(this.domainsinvoicesList);
  }
  
  ngOnInit(): void {
    this.loadBillingHistories();
   
  }

  loadBillingHistories(): void {
    this.domainInvoiceService.getAllBillingHistories().subscribe(
      (data) => {
        
        this.domainsinvoicesList = data.map((invoice: DomainInvoices) => ({
          ...invoice,
          invoiceDate: new Date(invoice.invoiceDate), 
          duedate: new Date(invoice.dueDate)          
        }));
        
        this.domainsDataSource.data = this.domainsinvoicesList; 
        this.domainsDataSource.paginator = this.paginator; 
        this.domainsDataSource.sort = this.sort; 
      },
      (error) => {
        console.error('Error fetching billing histories:', error);
      }
    );
  }

}
