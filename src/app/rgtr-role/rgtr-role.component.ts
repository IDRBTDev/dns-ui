import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Roles } from '../model/roles.model';
import { RolesService } from '../roles/services/roles.service';
import { RgtrRoleService } from './services/rgtr-role.service';

@Component({
  selector: 'app-rgtr-role',
  templateUrl: './rgtr-role.component.html',
  styleUrls: ['./rgtr-role.component.css']
})
export class RgtrRoleComponent implements OnInit {
  constructor(private roleService:RgtrRoleService,private router:Router,private toastr:ToastrService){
    this.roleDataSource = new MatTableDataSource<Roles>();
  }
  roleDataSource: MatTableDataSource<Roles>;
  role:Roles=new Roles();
  @ViewChild(MatSort) sort!:MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedRoleColumns: string[]=[
    //  "selectRiskCheck",
    "checkbox",
      "roleId",
      "roleName",
      // "permissionValue",
      "createdBy",
      "createdDateTime",
      "modifiedBy",
      "modifiedDateTime",
      "edit",
      "delete"
    ];
  ngOnInit(): void {
   this.fetchAllRoles();
  }
  toggleMainCheckBox(index: number){
    if(!$('#subCheckBox'+index).is(':checked')){
      $('#mainCheckBox').prop('checked',false);
      //$('#mainCheckBox').css
    }
    const anyUnchecked = $('.subCheckBox:not(:checked)').length > 0;
    $('#mainCheckBox').prop('checked', !anyUnchecked);
  }
    /**
   * 
   * @param mainCheckBox check subcheckbox if main checkbox is checked
   */
    checkSubCheckBoxes(mainCheckBox: any){
      if($('#mainCheckBox').is(':checked')){
        $('.subCheckBox').prop('checked', true);
      }else{
        $('.subCheckBox').prop('checked', false);
      }
   }
  roles:Roles[]=[]
  fetchAllRoles(){
    console.log(this.roles)
    this.roleService.getAllRoles().subscribe({
      next:response => {
        if(response.status === HttpStatusCode.Ok){
        this.roles=response.body;
        this.roleDataSource.data=this.roles;
        console.log(this.roles)
        setTimeout(() => {
          this.roleDataSource.sort=this.sort;
        }, 0);
        setTimeout(() => {
          this.roleDataSource.paginator=this.paginator;
        }, 0);
      }
      },error: error =>{
        if (error.status === HttpStatusCode.Unauthorized) {
          this.navigateToSessionTimeout();
        }
      }
    })
    }
    navigateToSessionTimeout() {
      this.router.navigateByUrl('/session-timeout');
    }

    roleNameErrorInfo:string;
    isRoleNameValid:boolean;
    validateRoleName() {
      const regex = /^\S.*[a-zA-Z\s]*$/;
      if (this.role.roleName === '' || this.role.roleName.trim()==="" || regex.test(this.role.roleName)===false) {
        if(this.role.roleName.startsWith(" ")){
          this.roleNameErrorInfo = 'Role name cannot start with space';
          this.isRoleNameValid=false;
        }
        else{
          this.roleNameErrorInfo = 'Role name is required';
          this.isRoleNameValid=false;
        }
      } else if (this.role.roleName.length < 3) {
        this.roleNameErrorInfo = 'Role name should have min of 3 characters'
        this.isRoleNameValid=false;
      }else if (this.role.roleName.length > 50){
        this.roleNameErrorInfo = 'Role name should not exceed more than 50 characters'
        this.isRoleNameValid=false;
      }
       else {
        this.roleNameErrorInfo = '';
        this.isRoleNameValid = true;
      }
      return this.isRoleNameValid;
    }
    
    
    createdRole:Roles
    existingRole:Roles=new Roles()
    createRole() {
      let isNameValid = true;
      let isPermissionValid = true;
      //validate on submit
      if (this.isRoleNameValid === false) {
        var valid = this.validateRoleName();
        isNameValid = valid;
      }
      // if(this.isPermissionValueValid === false){
      //   var valid = this.validatePermissionValue();
      //   isPermissionValid = valid;
      // }
      //if no form errors submit the form
      if (isNameValid ) {
        this.role.roleName=this.role.roleName.toUpperCase();
        this.role.createdBy =localStorage.getItem('firstName')+' '+localStorage.getItem('lastName'); 
        this.role.createdByEmailId = localStorage.getItem('email');
        this.roleService.createRole(this.role).subscribe({
          next: (response) => {
            if (response.status == HttpStatusCode.Created) {
              this.createdRole = response.body;
  
              this.toastr.success("Role created successfully !")
              //close form modal
              document.getElementById('closeAddModal').click();
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } 
          },error: error =>{
            if(error.status === HttpStatusCode.Unauthorized){
              this.router.navigateByUrl('/session-timeout');
            }else if(error.status === HttpStatusCode.Found){
              this.toastr.error('Role name '+this.role.roleName+' already exists')
              //close form modal
              //document.getElementById('closeAddModal').click();
            }else {
              this.toastr.error("Error while creating role. Please try again !")
            }
          }
        })
      }
  
    }

    clearErrorMessages(){
      //clear create form
      this.role.roleName = '';
      // this.role.permission.permissionId = 0;
  
      //clear create form error messages
      this.roleNameErrorInfo= '';
      // this.permissionValueErrorInfo = '';
  
      //clear update form error messages
      // this.updatedRoleNameErrorInfo = '';
  
      this.isRoleNameValid=false;
      // this.isPermissionValueValid = false;
    }
    isUpdatedRoleNameValid:boolean
    updateRole() {
      var isNameValid = true;
      // var isPermissionValid = true;
      //validate on submit
      if (this.isUpdatedRoleNameValid === false) {
        var valid = this.validateUpdatedRoleName();
        isNameValid =valid;
      }
      // if(this.isUpdatePermissionValueValid === false){
      //   var valid = this.validateUpdatePermissionValue();
      //   isPermissionValid = valid;
      // }
        //if no errors in form, allow to submit
      if(isNameValid){
      this.existingRole.roleName=this.existingRole.roleName.toUpperCase();
      this.existingRole.modifiedBy = localStorage.getItem('firstName')+' '+localStorage.getItem('lastName');
      this.existingRole.modifiedByEmailId = localStorage.getItem('email');
      //this.updatedRole.modifiedDateTime = new Date(Date.now)
      this.roleService.updateRole(this.existingRole).subscribe({
       next: (response) => {
          if (response.status == HttpStatusCode.Created) {
            this.toastr.success("Role updated sucessfully !")
            //close form modal
            document.getElementById('closeUpdateModal').click();
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        },error: error =>{
          if(error.status === HttpStatusCode.Unauthorized){
            this.router.navigateByUrl('/session-timeout');
          }else{
            this.toastr.error("Error occured while updating role. Please try again")
          }
        }
      })
      }
    }
    updatedRoleNameErrorInfo:string
    validateUpdatedRoleName() {
      const regex = /^\S.*[a-zA-Z\s]*$/;
      if (this.existingRole.roleName === '' || this.existingRole.roleName.trim()==="" || regex.test(this.existingRole.roleName)===false) {
        if(this.existingRole.roleName.startsWith(" ")){
          this.updatedRoleNameErrorInfo = 'Role name cannot start with space';
          this.isUpdatedRoleNameValid = false;
        }
        else{
          this.updatedRoleNameErrorInfo = 'Role name is required';
          this.isUpdatedRoleNameValid = false;
        }
      } else if (this.existingRole.roleName.length < 3) {
        this.updatedRoleNameErrorInfo = 'Role name should have min of 3 characters'
        this.isUpdatedRoleNameValid = false;
      } else if (this.existingRole.roleName.length > 50){
        this.updatedRoleNameErrorInfo = 'Role name should not exceed more than 50 characters'
        this.isUpdatedRoleNameValid = false;
      }else {
        this.updatedRoleNameErrorInfo = '';
        this.isUpdatedRoleNameValid = true;
      }
      return this.isUpdatedRoleNameValid;
    }

      /**
   * 
   * @param id 
   */
  getRoleById(id: number) {
    this.roleService.getRole(id).subscribe({
     next: (response) => {
        this.existingRole = response.body;
        console.log(this.existingRole)
      },error: error =>{
        if(error.status === HttpStatusCode.Unauthorized){
          this.router.navigateByUrl('/session-timeout');
        }
      }
  })
  }

  deleteRoleById(id: any) {
    var isConfirmed = window.confirm('Are you sure you want to delete this role ?');
    if (isConfirmed) {
      this.roleService.deleteSelectedRoles(id).subscribe({
        next: (response) => {
          if (response.status === HttpStatusCode.Ok) {
            this.toastr.success('Role deleted successfully')
            console.log("ke")
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        },error: error =>{
          if(error.status === HttpStatusCode.Unauthorized){
            this.router.navigateByUrl('/session-timeout');
          }else if(error.status === HttpStatusCode.ImUsed){
            this.toastr.error('The role currently in use by a user cannot be deleted');
          } else {
            this.toastr.error('Error while deleting role '+id+ '... Please try again !');
          }
        }
    })
    } else {
     // this.toastr.warning('Role '+id+' not deleted.');
    }
  }
  searchText: string = '';
  // applyFilter() {
  //   this.roleDataSource.filter = this.searchText.trim().toLowerCase(); // Filters based on search text

  //   if (this.roleDataSource.paginator) {
  //     this.roleDataSource.paginator.firstPage(); // Reset paginator to the first page after filtering
  //   }
  // }

  applyFilter() {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase(); // Get the filter text
  
    this.roleDataSource.filterPredicate = (data: any, filter: string) => {
   
      const displayedColumnsValues = this.displayedRoleColumns.map(column => {
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
    this.roleDataSource.filter = filterValue;
  
    // Reset paginator to the first page after filtering
    if (this.roleDataSource.paginator) {
      this.roleDataSource.paginator.firstPage();
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