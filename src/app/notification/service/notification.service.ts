import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/app/environments/environment";
import { Notification } from "src/app/model/Notification.model";
@Injectable({
    providedIn:'root'
})
export class NotificationService{
    private apiGatewayUrl: string;
    private notificationMicroservicePathUrl: string;
    constructor(private http: HttpClient){
        this.apiGatewayUrl =  environment.apiURL;
        this.notificationMicroservicePathUrl = 'dr/notification';
    }
    /**
     *
     * @param emailId
     * @returns
     */
    getTopTenNotificationsByUserId(emailId: string){
        return this.http.get<Notification[]>(`${this.apiGatewayUrl}/${this.notificationMicroservicePathUrl}/all/${emailId}`,
        {observe:'response'});
    }
    createNotification(notification : Notification){
        return this.http.post<Notification>(`${this.apiGatewayUrl}/${this.notificationMicroservicePathUrl}/create`,notification,
        {observe:'response'});
    }
    /**
     *
     * @param notification
     * @returns
     */
    updateNotification(notification : Notification){
        return this.http.put<Notification>(`${this.apiGatewayUrl}/${this.notificationMicroservicePathUrl}/update`,notification,
        {observe:'response'});
    }
    /**
     *
     * @param email
     * @returns
     */
    findNotificationCount(email: string){
        return this.http.get<number>(`${this.apiGatewayUrl}/${this.notificationMicroservicePathUrl}/count/${email}`,
        {observe:'response', headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        })});
    }
    getNotifications(email: string) {
        return this.http.get<any[]>(
          `${this.apiGatewayUrl}/${this.notificationMicroservicePathUrl}/all/${email}`,{ headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        })}
        );
      }

      markAllAsRead(emailId: string) {
        console.log(localStorage.getItem('jwtToken'));
        return this.http.put(`${this.apiGatewayUrl}/${this.notificationMicroservicePathUrl}/mark-all-as-read/${emailId}`, {}, { // Added empty object {} as body
            observe: 'response',
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            })
        });
    }
}