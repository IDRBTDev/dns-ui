import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { MainHeaderService } from './service/main-header.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit{

  user: User | null = null;

  constructor(private router: Router, private mainHeaderService: MainHeaderService,){}

  ngOnInit(): void {
   
  }

  cancelButton(){
    setTimeout(() => {
      
    }, 200);
    window.location.reload();
  }
  
  

  logout(){
    localStorage.clear();
    this.router.navigateByUrl('/login').then(() => {
      // Reload the page after navigation
      window.location.reload();
    });
  }

  onImageLoad() {
    console.log("Profile image successfully loaded into the DOM.");
  }  

}
