import { Component } from '@angular/core';
import { DomainInvoices } from '../model/domain-invoices.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminInvoiceDetailsService } from './service/admin-invoice-details.service';

@Component({
  selector: 'app-domain-invoice-details',
  templateUrl: './domain-invoice-details.component.html',
  styleUrls: ['./domain-invoice-details.component.css']
})
export class DomainInvoiceDetailsComponent {

  domainInvoices: DomainInvoices | null = null;
  loading: boolean = true;
  activatedRouter: any;

  constructor(
    private adminInvoiceDetailsService: AdminInvoiceDetailsService,
    private route: ActivatedRoute,private router: Router
  ) {}

 

  billingId: number = 0;
  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(param => {
      var billingId = param['billingId'];
      this.billingId = param['billingId'];
      
      console.log('Billing ID from URL:', this.billingId);
    })
    console.log(this.billingId)
    await this.getBillingHistoryById(this.billingId);
  }
  
  
  async getBillingHistoryById(billingId: number): Promise<void> {
    const response: DomainInvoices = await this.adminInvoiceDetailsService.getBillingHistoryById(billingId).toPromise();
    this.domainInvoices = response;

  }
  cancelInvoice(){
    this.router.navigateByUrl('invoices')
  }

}
