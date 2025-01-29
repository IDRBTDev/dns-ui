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
import { lastValueFrom } from 'rxjs';
import { error } from 'jquery';
import { HttpStatusCode } from '@angular/common/http';
import { jsPDF } from "jspdf";
import * as mammoth from 'mammoth';
import * as html2pdf from 'html2pdf.js';
import { DomainObject } from '../invoice-generation/service/invoice.service';
@Component({
  selector: 'app-domain-invoices',
  templateUrl: './domain-invoices.component.html',
  styleUrls: ['./domain-invoices.component.css']
})
export class DomainInvoicesComponent implements OnInit {
  
  displayedColumns: string[] = [
    'checkbox',
    'id',
    'organizationId',
    'finalAmount',
    'taxAmount',
    'invoice'
  ]; 

  userId: string = localStorage.getItem('email');
  role: string = localStorage.getItem('userRole');

  domainsinvoicesList: DomainInvoices[] = [];
  domainsDataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchText:String=''
  constructor(private domainService: DomainService, private router: Router, private domainInvoiceService: DomainInvoiceService
    ,private  domainObject : DomainObject
  ) {
    this.domainsDataSource = new MatTableDataSource<any>();
  }
  
  ngOnInit(): void {
    // if(this.role === 'IDRBTADMIN'){
    //   this.loadBillingHistories("");
    // }else{
    //   this.loadBillingHistories(this.userId);
    // }
    this.getAllInvoicesData();

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
  async getInvoiceDetailAndDisplay(domain : any){
    try{
      console.log("the invoce Details");
      const templateData = await this.loadTemplate('/assets/Invoicetemplate.docx');
      // Create a PizZip instance
     const zip = new PizZip(templateData as ArrayBuffer);
    console.log("Method entered");  
    // Create a Docxtemplater instance
    const doc = new Docxtemplater(zip);
    doc.setData({
       amount : domain.finalAmount
    })
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
  invoiceDetailsList : any[] =[]
  async getAllInvoicesData(){
    await lastValueFrom(this.domainInvoiceService.getAllInvoiceDetails()).then(
     (response) => {
       if(response.status === HttpStatusCode.Ok){
        this.invoiceDetailsList = response.body;
        console.log(this.invoiceDetailsList)
        this.domainsDataSource.data = this.invoiceDetailsList; 
        console.log(this.domainsDataSource.data)
        this.domainsDataSource.paginator = this.paginator; 
        this.domainsDataSource.sort = this.sort; 

       }

     }, (error) =>{

     }

    );
  }

  async getInvoiceDetailAndDisplayAsPDF(domain: any) {
    try {
      console.log("Fetching the invoice details...");
  
      // Load DOCX template
      const templateData = await this.loadTemplate1('/assets/Invoicetemplate.docx');
  
      // Convert DOCX to HTML using Mammoth
      const html = await this.convertDocxToHtml(templateData);
  
      console.log("Template converted to HTML");
  
      // Replace placeholders in HTML with dynamic data
      const populatedHtml = this.replacePlaceholders(html, domain);
  
     // Add padding to the HTML content
     const contentWithPadding = this.addPaddingToHTML(populatedHtml);
    // const cleanedHtml = this.cleanUpHTML(populatedHtml);
   
    //    // Ensure the table is styled properly
   //  const contentWithTableStyles = this.addTableStyles(contentWithPadding);

      // Generate PDF from the populated HTML
      this.generatePDF(contentWithPadding);
  
    } catch (error) {
      console.error("Error generating document:", error);
    }
  }
  
  // Load DOCX template
  async loadTemplate1(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return buffer;
  }
  
  // Convert DOCX to HTML using Mammoth
  async convertDocxToHtml(templateData: ArrayBuffer): Promise<string> {
    return new Promise((resolve, reject) => {
      mammoth.convertToHtml({ arrayBuffer: templateData })
        .then(result => resolve(result.value)) // Returning HTML string
        .catch(error => reject(error));
    });
  }

  // Add padding (especially left padding) to the HTML content
addPaddingToHTML(html: string): string {
  // You can either add a specific CSS class or inline styles
  const style = `
    <style>
      body {
        padding-left: 50px; /* Set the left padding here */
      }
      /* Optional: Add other custom styles */
    </style>
  `;

  // Inject the styles into the HTML content
  return style + '<div style="padding-left: 30px; padding-top:30px;">' + html + '</div>';
}


addTableStyles(html: string): string {
  const tableStyles = `
    <style>
      body {
        padding-left: 30px; /* Add left padding */
      }
      table {
        width: 100%;
        border-collapse: collapse; /* Ensures table borders collapse properly */
      }
      table, th, td {
        border: 1px solid black;
      }
      th, td {
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2; /* Light gray background for table header */
      }
         p, div {
        margin: 0;
        padding: 0;
      }
    </style>
  `;
    
  return tableStyles + html;
}

// Clean up unwanted HTML elements and styles
cleanUpHTML(html: string): string {
  // Remove empty paragraphs or divs that might be causing extra lines
  html = html.replace(/<p>\s*<\/p>/g, ''); // Remove empty paragraphs
  html = html.replace(/<div>\s*<\/div>/g, ''); // Remove empty divs

  // Remove any unwanted inline styles that may be causing borders or padding
  html = html.replace(/style=".*?"/g, ''); // Remove all inline styles

  return html;
}
  
  // Replace placeholders in HTML with dynamic data
  replacePlaceholders(html: string, domain: any): string {
    let populatedHtml = html.replace(/{amount}/g, domain.finalAmount);
    populatedHtml = populatedHtml.replace(/{invoiceNumber}/g, domain.invoiceNumber);
    // Add more replacements if needed
  
    return populatedHtml;
  }
  
  // Generate PDF from populated HTML using html2pdf.js
  generatePDF(htmlContent: string) {
    // Create a div container to hold the HTML content
    const pdfContainer = document.createElement('div');
    pdfContainer.innerHTML = htmlContent;
    document.body.appendChild(pdfContainer);
  
    // Use html2pdf to convert the content to a PDF
    // html2pdf()
    //   .from(pdfContainer)
    //   .save('invoice.pdf')
    //   .then(() => {
    //     console.log("PDF generated successfully");
    //     document.body.removeChild(pdfContainer); // Clean up
    //   });

      html2pdf()
  .from(pdfContainer)
  .set({
    margin: [10, 10, 10, 10], // Adjust margins
    filename: 'invoice.pdf',
    html2canvas: {
      scale: 3, // Improve rendering quality
      letterRendering: true, // Improve text rendering
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  })
  .save();
  }
  getDomainObjectandPasstoComponent(domain : any){
    this.domainObject.setDomain(domain);

  }


}