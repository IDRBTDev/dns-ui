import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { RgtrDepartment } from 'src/app/model/rgtrDepartment.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

     private departmentUrl = environment.apiURL+'/dr/departments';
     private priceDetailsUrl=environment.apiURL+'/dr/priceDetails';
 
     constructor(private httpClient: HttpClient){}


     getAllDepartments(){
      return this.httpClient.get<any>(`${this.departmentUrl}/all`,{observe: 'response'});
    }

    addDepartment(department){
      return this.httpClient.post<any>(`${this.departmentUrl}/save`,department,{observe: 'response'});
    }

    updateDepartment(department){
      return this.httpClient.put<any>(`${this.departmentUrl}/update`,department,{observe: 'response'});
    }

    fetchDepartmentById(departmentId){
      return this.httpClient.get<any>(`${this.departmentUrl}/${departmentId}`,{observe: 'response'});
    }

    deleteDepartment(departmentId){
      return this.httpClient.delete<any>(`${this.departmentUrl}/delete/${departmentId}`,{observe: 'response'});
    }

}
