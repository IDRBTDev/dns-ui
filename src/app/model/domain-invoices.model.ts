import { Domain } from "./domain.model";

export class DomainInvoices{
    billingId : number;
    invoiceNumber : string;
    amount : string;
    invoiceDate : Date;
    dueDate : Date;
    status : string;
    domainId : number;
    domainDto : Domain;
}