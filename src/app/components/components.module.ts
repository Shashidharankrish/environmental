import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsRoutingModule } from './components-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
//import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
//import { UserroleComponent } from './userrole/userrole.component';
//import { LoaderComponent } from './loader/loader.component';
// import { LocationComponent } from './location/location.component';
// import { AddEditLocationComponent } from './add-edit-location/add-edit-location.component';
// import { MoreSearchComponent } from './more-search/more-search.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
  //ConfirmationDialogComponent, 
  //UserroleComponent, 
  //LoaderComponent, 
  //LocationComponent, AddEditLocationComponent, MoreSearchComponent
  ]
})
export class ComponentsModule { }
