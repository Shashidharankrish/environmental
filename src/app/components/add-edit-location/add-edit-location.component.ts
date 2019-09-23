import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from 'app/models/location.model';
import { LocationService } from '@shared/services/location.service';
import { NotificationService } from '@shared/services/notification.service';
import { DashboardService } from '@shared/services/dashboard.service';


@Component({
  selector: 'app-add-edit-location',
  templateUrl: './add-edit-location.component.html',
  styleUrls: ['./add-edit-location.component.scss']
})
export class AddEditLocationComponent implements OnInit {
  @ViewChild('f')
    private form;
  isNewLocation = false;
  name: string;
  locationModel: Location;
  title: string;
  isSaving = false;
  editingThingName: string;
  results: any[] = [];
  parameters: any;
  range: any = {};
  validRange: boolean = true;
  requiredRange: boolean = true;

  public changesSavedCallback: () => void;
  public changesFailedCallback: () => void;
  public changesCancelledCallback: () => void;
  
  constructor(
    private locationservice: LocationService,
    private notifyService: NotificationService,
    private dashboardService: DashboardService
  ) {
    this.locationModel = <Location>{};
   }

  ngOnInit() {
    this.locationservice.getParentLocations().subscribe(
      res => {
        if (res['status'] == true) {
          this.results = res['list'];
        } 
      });

    this.dashboardService.getParameters().subscribe(
      res => {
        if (res['status'] == true) {
          this.parameters = res['list'];
          this.setRange();          
        } 
    });
    
  }

  setRange() {
    this.parameters.forEach(item => {
        this.range[item.key] = {'low': '', 'high': ''};
    });    
  }

  newLocation() {    
    this.title = 'Create  Location';
    this.isNewLocation = true;
    this.locationModel = <Location>{};    
    return this.locationModel;

  }

  editLocation(location) {
    if (location) {
      this.title = 'Edit';
      this.isNewLocation = false;
      this.editingThingName = location.locationName;
      this.locationModel.name = location.locationName;
      this.locationModel.parentLocation = location.parent_id;
      this.locationModel.id = location._id;
      if(location.range != undefined && Object.keys(location.range).length) {
        this.range = {...this.range, ...JSON.parse(JSON.stringify(location.range))};
      }
      return this.locationModel;
    } else {
      return this.newLocation();
    }
  }

  onSubmit(form: any): void {
   
    this.isSaving = true;
    if(!this.locationModel.parentLocation || this.locationModel.parentLocation == '0') {
      this.locationModel.range = this.range;
    }  
    if (!this.isNewLocation) { 
      this.locationservice.updateLocation(this.locationModel).subscribe(
        response => {
          this.isSaving = false;
          if(response.status == true){
            if (this.changesSavedCallback) {
              this.changesSavedCallback();
            }
            this.setRange();
            this.notifyService.showSuccess(response.message, 'Success');
          }else{
            this.notifyService.showError(response.message, 'Error');
          }
        });
      
    } else {  
      this.locationservice.createLocation(this.locationModel).subscribe(
        response => {
          this.isSaving = false;
          if(response.status == true){
            this.setRange();
            this.notifyService.showSuccess(response.message, 'Success');
            if (this.changesSavedCallback) {
              this.changesSavedCallback();
            }
          }else{
            this.notifyService.showError(response.message, 'Error');
          }
        });
        
      }
  }

  validate() {
    this.requiredRange = true;
    this.validRange = true;
    if(this.locationModel.parentLocation && this.locationModel.parentLocation != '0') {
      
    } else {
      for(let key in this.range) {          
          if(!this.range[key].low || !this.range[key].high) {
            this.requiredRange = false;
            break;
          } else if(this.range[key].low > this.range[key].high) {
            this.validRange = false;
            break;
          }
      }
    }
  }

  resetForm() {
    this.form.reset(true);
  }
}
