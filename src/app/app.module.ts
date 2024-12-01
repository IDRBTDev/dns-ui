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
import { DomainComponent } from './domain/domain.component';
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
import { MatDialogModule } from '@angular/material/dialog'; // Import MatDialogModule
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PreviewComponent } from './preview/preview.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { UserComponent } from './user/user.component';
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
    DomainComponent,
    SideMenuComponent,
    DomainApplicationComponent,
    DomainDetailsComponent,
    DomainApplicationDetailsComponent,
    UserComponent,
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
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'right'
    }),
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
