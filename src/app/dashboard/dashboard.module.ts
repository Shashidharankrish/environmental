import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUserComponent } from 'app/components/user/adduser.component';
import { EditUserComponent } from 'app/components/user/edituser.component';
import { UsersComponent } from 'app/components/user/users.component';
import { DataTablesModule } from 'angular-datatables';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AddThingsComponent } from 'app/components/things/add-things.component';
import { ThingsListComponent } from 'app/components/things/things-list.component';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { UserroleComponent } from 'app/components/userrole/userrole.component';
import { NgwWowModule } from 'ngx-wow';
import  { Ng2OdometerModule } from 'ng2-odometer';

import {MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule} from '@angular/material';
import { ProfileComponent } from 'app/components/profile/profile.component';
import { PasswordComponent } from 'app/components/password/password.component';
import { FileUploadModule } from 'ng2-file-upload';
import { MomentPipe } from 'app/moment.pipe';
import { FahrenheitPipe } from 'app/fahrenheit.pipe';
import { LocationComponent } from 'app/components/location/location.component';
import { AddEditLocationComponent } from 'app/components/add-edit-location/add-edit-location.component';
import { ChartModule } from 'angular-highcharts';
import { DashboardMainComponent } from './dashboard-main/dashboard-main.component';
import { MoreSearchComponent } from 'app/components/more-search/more-search.component';



@NgModule({
  imports: [
    ChartModule,
    NgwWowModule,
    Ng2OdometerModule.forRoot(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    DataTablesModule,
    NgxDatatableModule,
    MatDatepickerModule,
    MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
  FileUploadModule,
  ModalModule.forRoot()
  ],
  declarations: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    DashboardHomeComponent,
    AddUserComponent,
    EditUserComponent,
    UsersComponent,
    AddThingsComponent,
    ThingsListComponent,
    UserroleComponent,
    ProfileComponent,
    PasswordComponent,
    LocationComponent,
    AddEditLocationComponent,
    FahrenheitPipe,
    MomentPipe,
    DashboardMainComponent,
    MoreSearchComponent
  ]
})
export class DashboardModule { }
