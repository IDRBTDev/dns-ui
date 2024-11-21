import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HeaderComponent } from './header/header.component';
import { DomainComponent } from './domain/domain.component';
import { DomainApplicationComponent } from './domain-application/domain-application.component';
import { DomainDetailsComponent } from './domain-details/domain-details.component';
import { DomainApplicationDetailsComponent } from './domain-application-details/domain-application-details.component';
import { DomainInvoicesComponent } from './domain-invoices/domain-invoices.component';
import { DomainInvoiceDetailsComponent } from './domain-invoice-details/domain-invoice-details.component';

const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'landing', component: LandingComponent},
  {path:'login', component: LoginComponent},
  {path:'registration', component: RegistrationComponent},
  {path:'header', component: HeaderComponent},
  {path:'domains', component: DomainComponent},
  {path:'applications', component: DomainApplicationComponent},
  {path:'domain-details', component: DomainDetailsComponent},
  {path:'domain-application-details', component: DomainApplicationDetailsComponent},
  {path:'invoices', component: DomainInvoicesComponent},
  {path:'admin-invoice-details',component:DomainInvoiceDetailsComponent},
  {path:'',redirectTo:'/landing', pathMatch: 'full'},
  {path:'',component: LandingComponent},
  //{path:'domain-invoices',component:DomainInvoicesComponent},
  //{path:'full-header',component:FullHeaderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
