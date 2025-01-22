import { Organization } from "./organization.model";
import { Roles } from "./roles.model";

export class User{
    id : number;
    userId : string;
    userName : string;
    mobileNumber : string;
    encryptedPassword : string;
    previousPassword : string;
    previousPasswordOne : string;
    previousPasswordTwo : string;
    userRoles : Roles[];
    otp : number;
    profilePictureUrl: string;
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