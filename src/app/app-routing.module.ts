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
import { UserDomainDetailsComponent } from './user-domain-details/user-domain-details.component';
import { OnboardingStepperComponent } from './onboarding-stepper/onboarding-stepper.component';
import { UserSideMenuComponent } from './user-side-menu/user-side-menu.component';
import { DomainInvoicesComponent } from './domain-invoices/domain-invoices.component';
import { DomainInvoiceDetailsComponent } from './domain-invoice-details/domain-invoice-details.component';
import { UserComponent } from './user/user.component';
import { OrganisationDetailsComponent } from './organisation-details/organisation-details.component';
import { ContactDetailsFormComponent } from './contact-details-form/contact-details-form.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { AddDomainComponent } from './add-domain/add-domain.component';
import { PreviewComponent } from './preview/preview.component';
import { NameServerComponent } from './name-server/name-server.component';

const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'organisation-details', component: OrganisationDetailsComponent},
  {path:'contact-details-form', component: ContactDetailsFormComponent},
  {path:'landing', component: LandingComponent},
  {path:'login', component: LoginComponent},
  {path:'registration', component: RegistrationComponent},
  {path:'header', component: HeaderComponent},
  {path:'domains', component: DomainComponent},
  {path:'applications', component: DomainApplicationComponent},
  {path:'domain-details', component: DomainDetailsComponent},
  {path: 'domain-application-details', component: DomainApplicationDetailsComponent},
  {path: '',redirectTo:'/landing', pathMatch: 'full'},
  
  {path: 'user-domain-details', component:UserDomainDetailsComponent},
  {path: 'onboarding-stepper', component:OnboardingStepperComponent},
  {path: 'user-side-menu', component:UserSideMenuComponent},
  {path:'invoices', component: DomainInvoicesComponent},

  {path:'admin-invoice-details',component:DomainInvoiceDetailsComponent},
  {path: 'users', component: UserComponent},
  {path:'',redirectTo:'/landing', pathMatch: 'full'},
  {path:'',component: LandingComponent},
  {path:'mainHeader',component:MainHeaderComponent},
  //{path:'domain-invoices',component:DomainInvoicesComponent},
  //{path:'full-header',component:FullHeaderComponent}
  {path: 'invoice-details', component: DomainInvoiceDetailsComponent},
  {path: 'add-domain', component: AddDomainComponent},
  {path: 'preview', component: PreviewComponent},
  {path: 'name-server', component: NameServerComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }