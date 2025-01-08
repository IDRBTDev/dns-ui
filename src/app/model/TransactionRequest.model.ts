export class TransactionRequest{

    merchantId : String;
	operatingMode : String ;
    merchantKey : String ;
    merchantCountry : String;
    merchantCurrency : String;
    orderAmount : number;
    successURL : String;
    failURL : String;
    aggregatorId : String="SBIEPAY";
    merchantOrderNo : String;
    merchantCustomerID : String ;
    payMode : String;
    actionUrl : String;
    accessMedium : String;
    transactionSource : String;
}