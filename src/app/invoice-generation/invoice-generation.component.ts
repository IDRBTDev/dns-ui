import { Component, OnInit } from '@angular/core';
import * as mammoth from 'mammoth';
import * as html2pdf from 'html2pdf.js';
import { DomainObject } from './service/invoice.service';

@Component({
  selector: 'app-invoice-generation',
  templateUrl: './invoice-generation.component.html',
  styleUrls: ['./invoice-generation.component.css']
})
export class InvoiceGenerationComponent implements OnInit {


  domain : any = {}
  constructor(private domainObject: DomainObject){}

  ngOnInit(): void {
    console.log("data")
    this.domainObject.domain$.subscribe(domain => {
      this.domain = domain;
      // Do something with the domain object
      console.log(this.domain);
    });
    console.log("after method")
    this.getInvoiceDetailAndDisplayAsPDF(this.domain)
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
   //  const contentWithPadding = this.addPaddingToHTML(populatedHtml);
     const cleanedHtml = this.cleanUpHTML(populatedHtml);
   
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
}
