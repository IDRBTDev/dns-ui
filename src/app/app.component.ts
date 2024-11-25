import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dns-ui';
  constructor(private router: Router) {
    console.log('Available Routes:', this.router.config);
  }
}
