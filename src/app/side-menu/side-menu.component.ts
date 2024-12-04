import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit{

  isBoxVisible: boolean = false;
  boxContent: string = 'Settings Box Opened';
  role: string = localStorage.getItem('userRole');

  constructor(private router: Router) {
   
  
}
  ngOnInit(): void {
    // const boxState = localStorage.getItem('isBoxVisible');
    // if (boxState === 'true') {
    //   this.isBoxVisible = true;
    // }
  }

  

  isSettingsOpen = false;
  

  usernavigation() {
    this.router.navigate(['/users']).then(() => {
      // localStorage.setItem('isBoxVisible', String(this.isBoxVisible));
    });
  }

  rolenavigation() {
    this.router.navigate(['/roles']).then(() => {
      // localStorage.setItem('isBoxVisible', String(this.isBoxVisible));
    });
  
  }

  
  toggleBox(): void {
    this.isBoxVisible = true;
    // localStorage.setItem('isBoxVisible', String(this.isBoxVisible));
  }

  toggleBoxout(): void {
    setTimeout(() => {
      this.isBoxVisible = false;
      // localStorage.setItem('isBoxVisible', String(this.isBoxVisible));
      
    }, 800);
    
    
  }
   

}
