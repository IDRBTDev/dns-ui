import { Organization } from "./organization.model";

export class User{
    id : number;
    userId : string;
    userName : string;
    mobileNumber : string;
    encryptedPassword : string;
    previousPassword : string;
    previousPasswordOne : string;
    previousPasswordTwo : string;
    role : string;
    otp : number;
    profilePicture : Blob;
    isActive : boolean;
    loginAttemptCount : number;
    lastLoginIpAddress : string;
    lastLoginDeviceType : string;
    lastLoginDatetime : Date;
    createdDatetime : Date;
    updatedDatetime : Date;
    createdBy : string;
    updatedBy : string;
    createdByEmail : string;
    updatedByEmail : string;
    lastSuccessfulLoginDatetime : Date;


    organisationId : number; 
    organisationDetailsDto: Organization;
}