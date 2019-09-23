import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { AuthGuard } from '@shared/guards/auth.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { path: '', component:AuthComponent },
  { path: 'login', component:AuthComponent },
  { path:'dashboard',loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate:[AuthGuard]}, 
  { path: 'admin', loadChildren: './dashboard/dashboard.module#DashboardModule',canActivate:[AuthGuard] },
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
 // { path: 'pages', loadChildren: './pages/pages.module#PagesModule' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
 