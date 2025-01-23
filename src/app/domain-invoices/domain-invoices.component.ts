import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomainService } from '../rgnt-domain/service/domain.service';
import { Router } from '@angular/router';
import { DomainInvoices } from '../model/domain-invoices.model';
import { DomainInvoiceService } from './service/domain-invoices.service';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-domain-invoices',
  templateUrl: './domain-invoices.component.html',
  styleUrls: ['./domain-invoices.component.css']
})
export class DomainInvoicesComponent implements OnInit {
  
  displayedColumns: string[] = [
    'checkbox',
    'billingId',
    'organizationName',
    'invoiceNumber',
    'invoiceDate',
    'amount',
    'duedate',
    'status',
  ]; 

  userId: string = localStorage.getItem('email');
  role: string = localStorage.getItem('userRole');

  domainsinvoicesList: DomainInvoices[] = [];
  domainsDataSource: MatTableDataSource<DomainInvoices>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchText:String=''
  constructor(private domainService: DomainService, private router: Router, private domainInvoiceService: DomainInvoiceService) {
    this.domainsDataSource = new MatTableDataSource<DomainInvoices>(this.domainsinvoicesList);
  }
  
  ngOnInit(): void {
    if(this.role === 'IDRBTADMIN'){
      this.loadBillingHistories("");
    }else{
      this.loadBillingHistories(this.userId);
    }

    localStorage.setItem('isBoxVisible', 'false');
    
  }

  loadBillingHistories(userId: string): void {
    this.domainInvoiceService.getAllBillingHistories(userId).subscribe(
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

  
    goToInvoiceDetails(billingId: number){
      this.router.navigate(['/admin-invoice-details'],{queryParams:{billingId:billingId}});
    }

    applyFilter() {
      this.domainsDataSource.filter = this.searchText.trim().toLowerCase(); 
  
      if (this.domainsDataSource.paginator) {
        this.domainsDataSource.paginator.firstPage();
      }
  }
  async getInvoiceDetailAndDisplay(){
    try{
      console.log("the invoce Details");
      const templateData = await this.loadTemplate('/assets/Invoicetemplate.docx');
      // Create a PizZip instance
     const zip = new PizZip(templateData as ArrayBuffer);
    console.log("Method entered");  
    // Create a Docxtemplater instance
    const doc = new Docxtemplater(zip);
     // Render the document
     doc.render();

     // Generate the document blob
     const out = doc.getZip().generate({ type: "blob" });
       // Save the document
    FileSaver.saveAs(out, 'invoices.docx');
      
       console.log("Document saved successfully");

    }catch(error){
      console.error("Error generating document:", error);
    }
  }
  async loadTemplate(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.statusText}`);
    }
    return response.arrayBuffer();
  }
}