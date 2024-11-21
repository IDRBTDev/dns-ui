import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomainService } from '../domain/service/domain.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  displayedColumns: string[] = [
    'checkbox',
    'Slno',
    'UserId',
    'UserName',
    'Role',
    'Access',
    'UserStatus',
    'Actions',
  ]; // Matches matColumnDef values

  usersList: any[];
  usersDataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private router: Router) {
    this.usersDataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.getUsersList();
  }

  async getUsersList() {
    await lastValueFrom(this.userService.getAllUsers()).then(
      (response) => {
        if (response.status === HttpStatusCode.Ok) {
          console.log(response.body);
          this.usersList = response.body;
          this.usersDataSource.data = this.usersList;
          this.usersDataSource.paginator = this.paginator;
          setTimeout(() => {
            this.usersDataSource.sort = this.sort;
          }, 0);
        }
      },
      (error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.navigateToSessionTimeout();
        }
      }
    );
  }

  navigateToDomainDetails(domainId: number) {
    this.router.navigate(['/domain-details'], { queryParams: { domainId: domainId } });
  }

  navigateToSessionTimeout() {
    this.router.navigateByUrl('/session-timeout');
  }

  onAccessToggle(user: any): void {
    console.log(`Access toggled for user ${user.userId}:`, user.access);
    // Perform necessary actions, like API calls, if needed
  }

  user: any = null;
  async getUserById(id: number) {
    await lastValueFrom(this.userService.getUserById(id)).then(
      response => {
        if (response.status === HttpStatusCode.Ok) {
          this.user = response.body;
        }
      }, error => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.navigateToSessionTimeout();
        }
      }
    )
  }

  async updateUser(user: any) {
    await lastValueFrom(this.userService.updateUser(user)).then(response => {
      if (response.status === HttpStatusCode.PartialContent) {
        this.getUsersList();
      }
    }, error => {
      if (error.status === HttpStatusCode.Unauthorized) {
        this.navigateToSessionTimeout();
      }
    }
    )
  }

  async deleteUserById(id: number) {
    await lastValueFrom(this.userService.deleteUserById(id)).then(
      response => {
        if (response.status === HttpStatusCode.Ok) {
          this.getUsersList();
        }
      }, error => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.navigateToSessionTimeout();
        }
      }
    )
  }


}
