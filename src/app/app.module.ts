import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing/landing.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http'
import { ToastrModule } from 'ngx-toastr';
import { RgntDomainComponent } from './rgnt-domain/rgnt-domain.component';
import {MatTableModule} from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { SideMenuComponent } from './side-menu/side-menu.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import { DomainApplicationComponent } from './domain-application/domain-application.component';
import { DomainDetailsComponent } from './domain-details/domain-details.component';
import { DomainApplicationDetailsComponent } from './domain-application-details/domain-application-details.component';

import { UserDomainDetailsComponent } from './user-domain-details/user-domain-details.component';
import { NameServerFormComponent } from './name-server-form/name-server-form.component'
import { MatCardModule } from '@angular/material/card';
import { UserSideMenuComponent } from './user-side-menu/user-side-menu.component';
import { OnboardingStepperComponent } from './onboarding-stepper/onboarding-stepper.component';
import { ContactDetailsFormComponent } from './contact-details-form/contact-details-form.component';
import { OrganisationDetailsComponent } from './organisation-details/organisation-details.component';
import { MatStepperModule } from '@angular/material/stepper';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PreviewComponent } from './preview/preview.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MainHeaderComponent } from './main-header/main-header.component';
import { DomainInvoices } from './model/domain-invoices.model';
import { DomainInvoicesComponent } from './domain-invoices/domain-invoices.component';
import { DomainInvoiceDetailsComponent } from './domain-invoice-details/domain-invoice-details.component';
import { ContactDocumentUploadComponent } from './contact-document-upload/contact-document-upload.component';
import { AddDomainComponent } from './add-domain/add-domain.component';
import { NotificationComponent } from './notification/notification.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { NameServerComponent } from './name-server/name-server.component';
import * as $ from 'jquery';
import { DomainDetailsEditComponent } from './domain-details-edit/domain-details-edit.component';
import { RolesComponent } from './roles/roles.component';
import { RgtrRgntOfficerDetailsComponent } from './registrant-user-management/rgtr-rgnt-officer-details.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { VerifyDocumentsComponent } from './verify-documents/verify-documents.component';
import { RegistrationSuccessComponent } from './registration-success/registration-success.component';
import { ReminderComponent } from './reminder/reminder.component';
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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import { DscVerificationComponent } from './dsc-verification/dsc-verification.component';
import { RgntDomainApplicationDetailsComponent } from './rgnt-domain-application-details/rgnt-domain-application-details.component';
import { UploadPaymentDocumentComponent } from './upload-payment-document/upload-payment-document.component';
import { UploadPaymentDocumentChangeComponent } from './upload-payment-document-change/upload-payment-document-change.component';
 
Chart.register(ChartDataLabels);




@NgModule({
  exports:[DateAgoPipe],
  declarations: [
    DateAgoPipe,
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegistrationComponent,
    HeaderComponent,
    LandingComponent,
    RgntDomainComponent,
    SideMenuComponent,
    DomainApplicationComponent,
    DomainDetailsComponent,
    DomainApplicationDetailsComponent,
    RgtrRgntUserMgmtComponent,
    DomainInvoicesComponent,
    DomainInvoiceDetailsComponent,
    UserDomainDetailsComponent,
    NameServerFormComponent,
    UserSideMenuComponent,
    OnboardingStepperComponent,
    ContactDetailsFormComponent,
    OrganisationDetailsComponent,
     MainHeaderComponent,
    PreviewComponent,
    DocumentUploadComponent,
    ContactDocumentUploadComponent,
    AddDomainComponent,
    NotificationComponent,
    NameServerComponent,
    DomainDetailsEditComponent,
    RolesComponent,
    RgtrRgntOfficerDetailsComponent,
    VerifyDocumentsComponent,
    RegistrationSuccessComponent,
    ReminderComponent,
    ForgotPasswordResetComponent,
    ForgotPasswordEmailVerificationComponent,
    ForgotPasswordOtpValidationComponent,
    ForgotPasswordSuccessComponent,
    ChangePasswordComponent,
    RegistrarsDashboardComponent,
    RgntOfficerDetailsMgmtComponent,
    RgntUserManagementComponent,
    RgtrUsrMgmtComponent,
    RgtrDomainComponent,
    DscVerificationComponent,
    RgntDomainApplicationDetailsComponent,
    UploadPaymentDocumentComponent,
    UploadPaymentDocumentChangeComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      //timeOut: 3000,
     // positionClass: 'right'
    }),
    NgSelectModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatIconModule,
    MatCardModule,
    MatStepperModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
