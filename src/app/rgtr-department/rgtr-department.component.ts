import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DepartmentService } from './service/department.service';
import { RgtrDepartment } from '../model/rgtrDepartment.model';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpStatusCode } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UserService } from '../user/service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rgtr-department',
  templateUrl: './rgtr-department.component.html',
  styleUrls: ['./rgtr-department.component.css']
})
export class RgtrDepartmentComponent implements OnInit{


  constructor(private departmentService:DepartmentService,private toastr:ToastrService,
    private userService:UserService,private router:Router){
    this.departmentDataSource = new MatTableDataSource<any>();
    
  }
  ngOnInit(): void {
    this.getLoggedInUser();
    // this.getAllDepartments();
      
  }
  loggedInEmail:string=localStorage.getItem('email');
   departmentList: any[];
    departmentDataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    displayedDepartmentColumn=[
      'departmentId',
      'departmentName',
      'departmentCode',
      'departmentStatus',
      'createdDateTime',
      'modifiedBy',
      'modifiedDateTime',
      'active',
      'edit',
      'delete'
    ];


    getAllDepartments(){
      this.departmentService.getAllDepartments().subscribe({
        next:(response)=>{
          this.departmentList=response.body;
          console.log(this.departmentList)
          this.departmentDataSource.data=this.departmentList;
          this.departmentDataSource.sort=this.sort;
          setTimeout(() => {
            this.departmentDataSource.paginator=this.paginator;
          }, 0);
        }
      })
    }
    loggedInUser: any;
    async getLoggedInUser(){
       await lastValueFrom(this.userService.getRgtrUserByEmailId(this.loggedInEmail)).then(
        response => {
          if(response.status === HttpStatusCode.Ok){
            this.loggedInUser = response.body;
            console.log(this.loggedInUser)
            this.getAllDepartments();
          }
        },error => {
          console.log(error);
        }
       )
      }
    
    department:RgtrDepartment=new RgtrDepartment();
    createdDepartment: RgtrDepartment;
    isDepartmentNameValid:boolean=false;
    isDepartmentCodeValid:boolean=false;
    
  createDepartment(){
    let isNameValid = true;
    // let isHeadValid = true;
    let isCodeValid = true;
    // let isLocationValid = true;
    var flag = 0;
    
    if(this.isDepartmentNameValid === false){
      var valid = this.validateDepartmentName();
      isNameValid = valid;
      flag = 1;
    }
    if(this.isDepartmentCodeValid === false){
     var valid = this.validateDepartmentCode();
      isCodeValid = valid;
      flag = 1;
    }
   
   
    // if(flag==1){
    //   this.toastr.error('Please fill the required fields')
    // }
    if(isNameValid === true && isCodeValid === true
    ){
    //set createdBy
    // this.addDepartment.departmentName = this.transformToTitleCase(this.addDepartment.departmentName);
    // this.addDepartment.departmentAddress = this.transformToTitleCase(this.addDepartment.departmentAddress);
    // this.addDepartment.departmentCode = this.addDepartment.departmentCode.toUpperCase();

    this.department.createdBy =this.loggedInUser.userName;
    this.department.createdByEmailId = this.loggedInUser.userId;
    this.departmentService.addDepartment(this.department).subscribe({
      next: (response)=> {
        if(response.status === HttpStatusCode.Created){
          this.createdDepartment = response.body;
        this.toastr.success('Department added successfully')
        document.getElementById('closeAddModal').click();
          setTimeout(()=>{
            window.location.reload();
          },1000)
        }
      },error: (error) => {
        if(error.status === HttpStatusCode.Unauthorized){
          this.router.navigateByUrl('/session-timeout')
        }else if(error.status === HttpStatusCode.Found){
          this.toastr.error("Department name '"+this.department.departmentName+ "' already exists")
          //document.getElementById('closeAddModal').click();
        }else{
          this.toastr.error('Error occured while creating department. Please try again !')
        }
      }
     })
     }
  }
    // addDepartment(){
    //   this.departmentService.addDepartment(this.department).subscribe({
    //     next:(response)=>{
    //       this.toastr.success("Department added successfully");
    //     }
    //   })
    // }
    departmentNameErrorInfo: string = ''
    // isDepartmentNameValid = false;
    validateDepartmentName(){
     // var deptName=  event.target.value;
      const regex = /^\S.*[a-zA-Z\s]*$/;
      // const regex2=/^[A-Za-z ]+$/;
      if(this.department?.departmentName === '' || this.department?.departmentName.trim()==="" || regex.test(this.department.departmentName)===false){
        if(this.department.departmentName.startsWith(" ")){
          this.departmentNameErrorInfo = 'Department name cannot start with space.';
          this.isDepartmentNameValid = false;
        }
        else{
          this.departmentNameErrorInfo = 'Department name is required.';
          this.isDepartmentNameValid = false;
        }
      // }else if(regex2.test(this.addDepartment.departmentName) === false){
      //   this.departmentNameErrorInfo = 'Department name cannot have special characters or numbers.';
      //   this.isDepartmentNameValid = false;
      }
      else if(this.department.departmentName.length < 3){
        this.departmentNameErrorInfo = 'Department name should have minimum of 3 characters.';
        this.isDepartmentNameValid = false;
      }else if(this.department.departmentName.length > 30){
        this.departmentNameErrorInfo = 'Department name should not exceed more than 30 characters';
        this.isDepartmentNameValid = false;
      }else{
        this.isDepartmentNameValid = true;
        this.departmentNameErrorInfo = '';
      }
      return this.isDepartmentNameValid;
    }

    departmentCodeErrorInfo
    validateDepartmentCode(){
      //var deptCode = event.target.value;
      const regex = /^\S.*[a-zA-Z\s]*$/;
      if(this.department.departmentCode === ''|| this.department.departmentCode.trim()==="" || regex.test(this.department.departmentCode)===false){
        if(this.department.departmentCode.startsWith(" ")){
          this.departmentCodeErrorInfo = 'Department code cannot start with space.';
          this.isDepartmentCodeValid = false;
        }
        else{
          this.departmentCodeErrorInfo = 'Department code is required.';
          this.isDepartmentCodeValid = false;
        }
      }else if(this.department.departmentCode.length < 2){
        this.departmentCodeErrorInfo = 'Department code should be minimum of 2 characters.';
        this.isDepartmentCodeValid = false;
      }else if(this.department.departmentCode.length > 15){
        this.departmentCodeErrorInfo = 'Department code should not exceed more than 15 characters.';
        this.isDepartmentCodeValid = false;
      }
      else{
        this.isDepartmentCodeValid = true;
        this.departmentCodeErrorInfo = '';
      }
      return this.isDepartmentCodeValid;
    }

    clearErrorMessages(){

    }

    existingDepartment:RgtrDepartment=new RgtrDepartment();
    isUpdatedDepartmentNameValid:boolean=false;
    isUpdatedDepartmentCodeValid:boolean=false;
    modifyDepartment(){
      var flag = 0;
      let isNameValid = true;
      let isHeadValid = true;
      let isCodeValid = true;
      let isLocationValid = true;
      
      if(this.isUpdatedDepartmentNameValid === false){
        var valid = this.validateUpdatedDepartmentName();
        isNameValid = valid;
        flag = 1;
      }
      if(this.isUpdatedDepartmentCodeValid === false){
       var valid = this.validateUpdatedDepartmentCode();
        isCodeValid = valid;
        flag = 1;
      }
      
      // if(flag===1){
      //   this.toastr.error('Please fill the required fields')
      // }
      if(isNameValid === true && isCodeValid === true){
  
      //   this.existingDepartment.departmentName = this.transformToTitleCase(this.existingDepartment.departmentName);
      //   this.existingDepartment.departmentAddress = this.transformToTitleCase(this.existingDepartment.departmentAddress);
      //   this.existingDepartment.createdBy = this.transformToTitleCase(this.existingDepartment.createdBy);
      //   this.existingDepartment.departmentCode = this.existingDepartment.departmentCode.toUpperCase();
  
      this.existingDepartment.modifiedBy =this.loggedInUser.userName;
      this.departmentService.updateDepartment(this.existingDepartment).subscribe({
        next: (response) => {
          if(response.status === HttpStatusCode.Created){
            this.toastr.success("Department updated successfully")
            document.getElementById('closeUpdateModal').click();
            setTimeout(()=>{
              window.location.reload();
            },1000)
          }
        },error: (error) => {
          if(error.status === HttpStatusCode.Unauthorized){
            this.router.navigateByUrl('/session-timeout')
          }
          else if(error.status === HttpStatusCode.Found){
            this.toastr.error("Department name '" +this.existingDepartment.departmentName+ "' already exists")
        }
        }
       })
       }
    }

    updatedDepartmentNameErrorInfo: string = ''
    // isUpdatedDepartmentNameValid = false;
    validateUpdatedDepartmentName(){
      // var deptName=  event.target.value;
      const regex = /^\S.*[a-zA-Z\s]*$/;
      // const regex2=/^[A-Za-z ]+$/;
       if(this.existingDepartment.departmentName === ''|| this.existingDepartment.departmentName.trim()==="" || regex.test(this.existingDepartment.departmentName)===false){
         if(this.existingDepartment.departmentName.startsWith(" ")){
          this.updatedDepartmentNameErrorInfo = 'Department name cannot start with space.';
         this.isUpdatedDepartmentNameValid = false;
         }
         else{
          this.updatedDepartmentNameErrorInfo = 'Department name is required.';
         this.isUpdatedDepartmentNameValid = false;
         }
      //  }else if(regex2.test(this.existingDepartment.departmentName) === false){
      //   this.updatedDepartmentNameErrorInfo = 'Department name cannot have special characters or numbers.';
      //   this.isUpdatedDepartmentNameValid = false;
       }
       else if(this.existingDepartment.departmentName.length < 3){
         this.updatedDepartmentNameErrorInfo = 'Department name should have minimum of 3 characters.';
         this.isUpdatedDepartmentNameValid = false;
       }else if(this.existingDepartment.departmentName.length > 30){
         this.updatedDepartmentNameErrorInfo = 'Department name should not exceed more than 30 characters.';
         this.isUpdatedDepartmentNameValid = false;
       }else{
         this.isUpdatedDepartmentNameValid = true;
         this.updatedDepartmentNameErrorInfo = '';
       }
       return this.isUpdatedDepartmentNameValid;
     }

     updatedDepartmentCodeErrorInfo: string = ''
    //  isUpdatedDepartmentCodeValid = false;
     validateUpdatedDepartmentCode(){
       //var deptCode = event.target.value;
       const regex = /^\S.*[a-zA-Z\s]*$/;
       if(this.existingDepartment.departmentCode === '' || this.existingDepartment.departmentCode.trim()==="" || regex.test(this.existingDepartment.departmentCode)===false){
         if(this.existingDepartment.departmentCode.startsWith(" ")){
           this.updatedDepartmentCodeErrorInfo = 'Department code cannot start with space.';
           this.isUpdatedDepartmentCodeValid=false;
         }
         else{
           this.updatedDepartmentCodeErrorInfo = 'Department code is required.';
           this.isUpdatedDepartmentCodeValid=false;
         }
       }else if(this.existingDepartment.departmentCode.length < 1){
         this.updatedDepartmentCodeErrorInfo = 'Department code should be minimum of 1 characters.';
         this.isUpdatedDepartmentCodeValid=false;
       }else if(this.existingDepartment.departmentCode.length > 15){
         this.updatedDepartmentCodeErrorInfo = 'Department code should not exceed more than 15 characters.';
         this.isUpdatedDepartmentCodeValid=false;
       }
       else{
         this.isUpdatedDepartmentCodeValid = true;
         this.updatedDepartmentCodeErrorInfo = '';
       }
       return this.isUpdatedDepartmentCodeValid;
     }
     fetchOneDepartment(departmentId: number){
      this.departmentService.fetchDepartmentById(departmentId).subscribe({
        next: (response)=>{
          if(response.status === HttpStatusCode.Ok){
           this.existingDepartment = response.body;
          }
        },error: (error) => {
          if(error.status === HttpStatusCode.Unauthorized){
            this.router.navigateByUrl('/session-timeout')
          }
        }
      })
    }

    deletedepartmentById(departmentId: number){
      // document.getElementById('deleteConfirmModal').click();
      var isConfirmed = window.confirm('Are you sure, you really want to delete this department?')
      if(isConfirmed){
       this.departmentService.deleteDepartment(departmentId).subscribe({
         next:(response) => {
          console.log(response)
           if(response.status === HttpStatusCode.Ok){
             var result = response.body;
             this.toastr.success('Department '+departmentId+' deleted successfully')
             setTimeout(()=>{
               window.location.reload();
             },1000)
           } else if(response.status === HttpStatusCode.ImUsed){
            this.toastr.error("Department is already in usage by a user, cannot be deleted.");
          }
         },error: (error) => {
          console.log(error)
           if(error.status === HttpStatusCode.Unauthorized){
             this.router.navigateByUrl('/session-timeout')
           }
           else if(error.status === HttpStatusCode.ImUsed){
             this.toastr.error("Department is already in usage by an user, cannot be deleted.");
           }
           else{
             this.toastr.error('Error occured while deleting department ' + departmentId  +'. Please try again !')
           }
         }
      })
      }else{
      // this.toastr.warning('Department '+departmentId+' not deleted.')
      }
     }
     searchText='';
     applyFilter() {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase(); // Get the filter text
    
      this.departmentDataSource.filterPredicate = (data: any, filter: string) => {
     
        const displayedColumnsValues = this.displayedDepartmentColumn.map(column => {
          if (column === 'createdDateTime' || column === 'modifiedDateTime') {
            // For date columns, format the date to 'MMM d, y, h:mm a' format
            const dateValue = data[column];
            return this.formatDate(new Date(dateValue.endsWith('Z') ? dateValue : dateValue + 'Z'));
          } else {
            // For non-date columns, return the column value
            return data[column];
          }
        });
    
        // Perform a case-insensitive search across the columns
        return displayedColumnsValues.some(value =>
          value?.toString().toLowerCase().includes(filter)
        );
      };
    
      // Apply the filter value to the data source
      this.departmentDataSource.filter = filterValue;
    
      // Reset paginator to the first page after filtering
      if (this.departmentDataSource.paginator) {
        this.departmentDataSource.paginator.firstPage();
      }
    }
    
    formatDate(date: Date): string {
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',  // 'Jan', 'Feb', etc.
        day: 'numeric',  // '30', '1', etc.
        year: 'numeric', // '2025', '2026', etc.
        hour: 'numeric', // '3', '12', etc.
        minute: 'numeric', // '46', '30', etc.
        hour12: true, // AM/PM format
      };
    
      return date.toLocaleString('en-US', options); // Format as 'Jan 30, 2025, 3:46 PM'
    }
}
