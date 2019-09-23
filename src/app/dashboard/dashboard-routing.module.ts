import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { AddUserComponent } from 'app/components/user/adduser.component';
import { UsersComponent } from 'app/components/user/users.component';
import { EditUserComponent } from 'app/components/user/edituser.component';
import { ThingsListComponent } from 'app/components/things/things-list.component';
import { AddThingsComponent } from 'app/components/things/add-things.component';
import { MainFluxGuard } from '@shared/guards/mainflux.guard';
import { UserroleComponent } from 'app/components/userrole/userrole.component';
import { ProfileComponent } from 'app/components/profile/profile.component';
import { PasswordComponent } from 'app/components/password/password.component';
import { DashboardMainComponent } from './dashboard-main/dashboard-main.component';
import { MoreSearchComponent} from 'app/components/more-search/more-search.component'
import { AdduserGuard } from '@shared/guards/adduser.guard';
import { UserlistGuard } from '@shared/guards/userlist.guard';
import { EdituserGuard } from '@shared/guards/edituser.guard';
import { RoleGuard } from '@shared/guards/role.guard';
import { DevicelistGuard } from '@shared/guards/devicelist.guard';
import { AdddeviceGuard } from '@shared/guards/adddevice.guard';
import { LocationComponent } from 'app/components/location/location.component';
const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      { path: '', component: DashboardMainComponent },
      { path: 'dashboard-main', component: DashboardMainComponent },
      { path: 'dashboard', component: DashboardHomeComponent },
      { path: 'users', component: UsersComponent, canActivate: [UserlistGuard] },
      { path: 'adduser', component: AddUserComponent, canActivate: [AdduserGuard] },
      { path: 'edituser/:userid', component: EditUserComponent, canActivate: [EdituserGuard] },
      { path: 'userrole', component: UserroleComponent, canActivate: [RoleGuard] },
      { path: 'components', loadChildren: '../components/components.module#ComponentsModule' },
      { path: 'devices', component: ThingsListComponent, canActivate: [DevicelistGuard]/*, canActivate:[MainFluxGuard] */ },
      { path: 'adddevice', component: AddThingsComponent, canActivate: [AdddeviceGuard] /*, canActivate:[MainFluxGuard] */ },
      { path: 'profile', component: ProfileComponent },
      { path: 'password', component: PasswordComponent },
      { path: 'location', component: LocationComponent },
      {path : 'moresearch', component: MoreSearchComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
