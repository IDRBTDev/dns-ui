import TimeAgo from "javascript-time-ago";

export interface Notification{
    message: string;
    moduleType: string;
    moduleRecordId: number;
    notificationTo: string;
    emailId: string;
    status: string;
    createdDateTime: string; // Using string to represent date in ISO format (e.g. '2024-12-07T15:00:00')
    createdByEmailId: string;
    profilepic: Blob;

}