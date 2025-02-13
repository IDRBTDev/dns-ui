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
import { UserService } from '../user/service/user.service';
@Component({
  selector: 'app-domain-invoices',
  templateUrl: './domain-invoices.component.html',
  styleUrls: ['./domain-invoices.component.css']
})
export class DomainInvoicesComponent implements OnInit {
  
  displayedColumns: string[] = [
    'checkbox',
    'id',
    'organisationName',
    'domainName',
    'finalAmount',
    'taxAmount',
    'invoice',
    'paymentStatus'
  ]; 

  userId: string = localStorage.getItem('email');
  role: string = localStorage.getItem('userRole');
  organisationId : number  = 0;

  domainsinvoicesList: DomainInvoices[] = [];
  domainsDataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchText:String=''
  constructor(private domainService: DomainService, private router: Router, private domainInvoiceService: DomainInvoiceService
    ,private  domainObject : DomainObject, private userService:UserService,
  ) {
    this.domainsDataSource = new MatTableDataSource<any>();
  }
  
  async ngOnInit(): Promise<void> {
    // if(this.role === 'IDRBTADMIN'){
    //   this.loadBillingHistories("");
    // }else{
    //   this.loadBillingHistories(this.userId);
    // }
   await this.getLoggedInUserDetails();
   console.log(this.organisationId)
   console.log(this.role)
   if(this.organisationId == 0 && this.role == 'IDRBTADMIN'){
     this.getAllInvoicesData();

   }else{
     this.getAllInvoicesDataByOrgId(this.organisationId)
   }
   // this.getAllInvoicesData();

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
        if(error.status == HttpStatusCode.Unauthorized){
           this.router.navigateByUrl("/session-timeout")
        }

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
     const rupees =  await this.numberToWords(domain.finalAmount)
      const populatedHtml = this.replacePlaceholders(html, domain, rupees);
  
     // Add padding to the HTML content
     const contentWithPadding = this.addPaddingToHTML(populatedHtml);
    const cleanedHtml = this.cleanUpHTML(contentWithPadding);
   
    //    // Ensure the table is styled properly
    const contentWithTableStyles = this.addTableStyles(cleanedHtml);

      // Generate PDF from the populated HTML
      this.generatePDF(contentWithTableStyles);
  
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
      .pdf-content {
        padding-left: 25px; /* Set the left padding here */
        padding-top: 20px;
        padding-right :10px;
      }
    </style>
  `;
   // Wrap the HTML content inside a container with the class
   return style + `<div class="pdf-content">${html}</div>`;
}


addTableStyles(html: string): string {
  const tableStyles = `
  <style>
    .pdf-content table {
      width: 100%;
      border-collapse: collapse; /* Ensures table borders collapse properly */
    }
    .pdf-content table, .pdf-content th, .pdf-content td {
      border: 1px solid black;
    }
    .pdf-content th, .pdf-content td {
      padding: 8px;
      text-align: left;
    }
    .pdf-content th {
      background-color: #f2f2f2; /* Light gray background for table header */
    }
    .pdf-content p, .pdf-content div {
      margin: 0;
      padding: 0;
    }
  </style>
`;
    
return tableStyles + `<div class="pdf-content">${html}</div>`;
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
  
rupee : string =""
  // Replace placeholders in HTML with dynamic data
 replacePlaceholders(html: string, domain: any, rupee : string): string {
    let populatedHtml = html.replace(/{amount}/g, domain.finalAmount);
    populatedHtml = populatedHtml.replace(/{rupee}/g, rupee);
    populatedHtml = populatedHtml.replace(/{id}/g, domain.id);
    // Add more replacements if needed
  
    return populatedHtml;
  }
  
  // Generate PDF from populated HTML using html2pdf.js
  generatePDF(htmlContent: string) {
    // Create a div container to hold the HTML content
    const pdfContainer = document.createElement('div');
    pdfContainer.classList.add('pdf-content');
    pdfContainer.innerHTML = htmlContent;
    document.body.appendChild(pdfContainer);
  
    //Use html2pdf to convert the content to a PDF
    html2pdf()
      .from(pdfContainer)
      .save('invoice.pdf')
      .then(() => {
        console.log("PDF generated successfully");
        document.body.removeChild(pdfContainer); // Clean up
      });

  //     html2pdf()
  // .from(pdfContainer)
  // .set({
  //   margin: [10, 10, 10, 10], // Adjust margins
  //   filename: 'invoice.pdf',
  //   html2canvas: {
  //     scale: 3, // Improve rendering quality
  //     letterRendering: true, // Improve text rendering
  //   },
  //   jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  // })
  // .save();
  }
  getDomainObjectandPasstoComponent(domain : any){
    this.domainObject.setDomain(domain);

  }
  numberToWords(num: number): string {
    if (num === 0) return "zero";

    const ones: string[] = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens: string[] = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const thousands: string[] = ["", "thousand", "million", "billion", "trillion"];

    let words = "";

    function helper(n: number): string {
        if (n === 0) return "";
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
        if (n < 1000) return ones[Math.floor(n / 100)] + " hundred" + (n % 100 !== 0 ? " " + helper(n % 100) : "");
        return "";
    }

    let chunkIndex = 0;
    while (num > 0) {
        if (num % 1000 !== 0) {
            words = helper(num % 1000) + (thousands[chunkIndex] ? " " + thousands[chunkIndex] : "") + " " + words;
        }
        num = Math.floor(num / 1000);
        chunkIndex++;
    }

    return words.trim();
}


async getAllInvoicesDataByOrgId(orgId : number){
  await lastValueFrom(this.domainInvoiceService.getAllInvoiceDetailsByOrgId(orgId)).then(
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
      if(error.status == HttpStatusCode.Unauthorized){
         this.router.navigateByUrl("/session-timeout")
      }

   }

  );
}
async getLoggedInUserDetails(){
  await lastValueFrom(this.userService.getUserByEmailId(localStorage.getItem('email'))).then(
    response => {
      if(response.status === HttpStatusCode.Ok){
       this.organisationId=response.body.organisationId;
       if(this.role !== 'IDRBTADMIN'){
        console.log('exe')
        console.log(this.organisationId)

      }
      }
    }, error => {
      if(error.status === HttpStatusCode.Unauthorized){
        this.navigateToSessionTimeout();
      }
    }
  )
}

navigateToSessionTimeout() {
  this.router.navigateByUrl('/session-timeout');
}

}