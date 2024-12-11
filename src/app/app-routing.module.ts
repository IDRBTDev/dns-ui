import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HeaderComponent } from './header/header.component';
import { RgntDomainComponent } from './rgnt-domain/rgnt-domain.component';
import { DomainApplicationComponent } from './domain-application/domain-application.component';
import { DomainDetailsComponent } from './domain-details/domain-details.component';
import { DomainApplicationDetailsComponent } from './domain-application-details/domain-application-details.component';
import { UserDomainDetailsComponent } from './user-domain-details/user-domain-details.component';
import { OnboardingStepperComponent } from './onboarding-stepper/onboarding-stepper.component';
import { UserSideMenuComponent } from './user-side-menu/user-side-menu.component';
import { DomainInvoicesComponent } from './domain-invoices/domain-invoices.component';
import { DomainInvoiceDetailsComponent } from './domain-invoice-details/domain-invoice-details.component';
import { OrganisationDetailsComponent } from './organisation-details/organisation-details.component';
import { ContactDetailsFormComponent } from './contact-details-form/contact-details-form.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { AddDomainComponent } from './add-domain/add-domain.component';
import { PreviewComponent } from './preview/preview.component';
import { NameServerComponent } from './name-server/name-server.component';
import { DomainDetailsEditComponent } from './domain-details-edit/domain-details-edit.component';
import { RolesComponent } from './roles/roles.component';
import { RgtrRgntOfficerDetailsComponent } from './registrant-user-management/rgtr-rgnt-officer-details.component';
import { VerifyDocumentsComponent } from './verify-documents/verify-documents.component';
import { RegistrationSuccessComponent } from './registration-success/registration-success.component';
import { ForgotPasswordResetComponent } from './forgot-password-reset/forgot-password-reset.component';
import { ForgotPasswordEmailVerificationComponent } from './forgot-password-email-verification/forgot-password-email-verification.component';
import { ForgotPasswordOtpValidationComponent } from './forgot-password-otp-validation/forgot-password-otp-validation.component';
import { ForgotPasswordSuccessComponent } from './forgot-password-success/forgot-password-success.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RegistrarsDashboardComponent } from './registrars-dashboard/registrars-dashboard.component';
import { RgntOfficerDetailsMgmtComponent } from './rgnt-officer-details-mgmt/rgnt-officer-details-mgmt.component';
import { RgntUserManagementComponent } from './rgnt-user-management/rgnt-usr-mgmt.component';
import { RgtrRgntUserMgmtComponent } from './user/rgtr-rgnt-usr-mgmt.component';
import { RgtrUsrMgmtComponent } from './rgtr-usr-mgmt/rgtr-usr-mgmt.component';
import { RgtrDomainComponent } from './rgtr-domain/rgtr-domain.component';
import { DscVerificationComponent } from './dsc-verification/dsc-verification.component';




const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'organisation-details', component: OrganisationDetailsComponent},
  {path:'contact-details-form', component: ContactDetailsFormComponent},
  {path:'landing', component: LandingComponent},
  {path:'login', component: LoginComponent},
  {path:'registration', component: RegistrationComponent},
  {path:'header', component: HeaderComponent},
  {path:'applications', component: DomainApplicationComponent},
  {path:'domain-details', component: DomainDetailsComponent},
  {path: 'domain-application-details', component: DomainApplicationDetailsComponent},
  {path: '',redirectTo:'/landing', pathMatch: 'full'},
  {path:'DomainEditPage',component:DomainDetailsEditComponent},
  {path: 'user-domain-details', component:UserDomainDetailsComponent},
  {path: 'onboarding-stepper', component:OnboardingStepperComponent},
  {path: 'user-side-menu', component:UserSideMenuComponent},
  {path:'invoices', component: DomainInvoicesComponent},

  {path:'admin-invoice-details',component:DomainInvoiceDetailsComponent},
  {path:'',redirectTo:'/landing', pathMatch: 'full'},
  {path:'',component: LandingComponent},
  {path:'mainHeader',component:MainHeaderComponent},
  //{path:'domain-invoices',component:DomainInvoicesComponent},
  //{path:'full-header',component:FullHeaderComponent}
  {path: 'invoice-details', component: DomainInvoiceDetailsComponent},
  {path: 'add-domain', component: AddDomainComponent},
  {path: 'preview', component: PreviewComponent},
  {path: 'name-server', component: NameServerComponent},
  {path: 'verify-documents', component: VerifyDocumentsComponent},
  {path: 'reg-success', component: RegistrationSuccessComponent},
  {path:'forgot-password-reset', component:ForgotPasswordResetComponent},
  {path:'forgot-password-email-verification', component:ForgotPasswordEmailVerificationComponent},
  {path:'forgot-password-otp-validation', component:ForgotPasswordOtpValidationComponent},
  {path:'forgot-password-success', component:ForgotPasswordSuccessComponent},
  {path:'change-password',component:ChangePasswordComponent},

  {path:'registrar-dashboard',component:RegistrarsDashboardComponent},
  // settings menu paths
  {path: 'rgnt-ofd', component: RgntOfficerDetailsMgmtComponent},
  {path: 'rgtr-rgnt-ofd', component: RgtrRgntOfficerDetailsComponent},
  {path:'rgnt-um', component: RgntUserManagementComponent},
  {path: 'rgtr-rgnt-um', component: RgtrRgntUserMgmtComponent},
  {path: 'rgtr-um', component: RgtrUsrMgmtComponent},
  {path: 'rgtr-role', component:RolesComponent},
  {path:'rgnt-domains', component: RgntDomainComponent},
  {path:'rgtr-domains', component: RgtrDomainComponent},
  {path: 'dsc-verification', component: DscVerificationComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }