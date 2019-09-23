import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ThingService } from '../../shared/services/thing.service';
import { Thing } from 'app/models/thing.model';
import { Router } from '@angular/router';
import { NotificationService } from '@shared/services/notification.service';
import { ChannelService } from '@shared/services/channel.service';
import { Channel } from 'app/models/channel.model';
import { Device } from 'app/models/device.model';
import { Location } from 'app/models/location.model';
import { LocationService } from '@shared/services/location.service';

@Component({
  selector: 'app-add-things',
  templateUrl: './add-things.component.html',
  styleUrls: ['./add-things.component.css']
})
export class AddThingsComponent implements OnInit {

  @ViewChild('f')
    private form;
  isNewThing = false;
  rows;
  thingform: FormGroup;
  name: string;
  thingModel: Thing;
  locationModel: Location;
  channelModel: Channel;
  deviceModel: Device;
  title: string;
  isSaving = false;
  editingThingName: string;
  allTypes: string[];
  thingkey: String;
  public changesSavedCallback: () => void;
  public changesFailedCallback: () => void;
  public changesCancelledCallback: () => void;
  
  constructor(
        private fb: FormBuilder,
        private thingService: ThingService, 
        private router: Router,
        private notifyService : NotificationService,
        private channelService: ChannelService,
        private locationservice: LocationService)
        {
          this.thingModel = <Thing>{};
          this.channelModel = <Channel>{};
          this.locationModel = <Location>{};
        }
  ngOnInit() {
  this.allTypes = ['app', 'device'];
  this.isNewThing = true;
  this.getLocations()
  }
  getLocations(){
    this.locationservice.getAvailableLocations().subscribe(
      res => {
        if (res) {
          this.rows = res['list'];
        } else if (res['status'] == true) {
          this.rows = res['list'];
        }
        
      });
  }
  onSubmit(form: any): void {
   
    this.isSaving = true;  
    if (!this.isNewThing) { 
      this.locationservice.updateThing(this.locationModel).subscribe(
        response =>{    
          if(response.status == true)  {
            this.notifyService.showSuccess(`\"${this.locationModel.deviceName}\" was saved successfully`,'Success');      
            this.isSaving = false;
            if (this.changesSavedCallback) {
              this.changesSavedCallback();
            }
            this.resetForm(); 
          } else {
            this.isSaving = false;
            this.notifyService.showError(response.message,'Error');
          }
                               
        },
        error => {
          this.isSaving = false;
          this.notifyService.showError('Something went wrong','Error');      
              if (this.changesSavedCallback) {
                this.changesSavedCallback();
              }
              this.resetForm();
        });
      
    } else {  
      
        this.locationservice.createThing(this.locationModel).subscribe( 
          response => {
            this.isSaving = false;
            if(response['status'] == false){
              this.notifyService.showError(response['message'], 'Error');
              
            }else{
              this.notifyService.showSuccess(response['message'],'Success'); 
              this.router.navigate(['/admin/devices']);
              this.resetForm();
            }
          },
            error => {
              this.isSaving = false;
            this.notifyService.showError(error, 'Error'); 
            });
      }
  }

  resetForm() {
    this.form.reset(true);
  }

  editThing(thing) { 
    if (thing) {
      this.title = 'Edit';
      this.isNewThing = false;
      this.editingThingName = thing.deviceName;
      this.locationModel.id = thing._id;
      this.locationModel.deviceName = thing.deviceName;
      this.locationModel.deviceLocation = thing.deviceLocation._id;
      Object.assign(this.thingModel, thing);
      return this.thingModel;
    } else {
      return this.newThing();
    }
  }

  newThing() {
    this.title = 'Create  thing';
    this.isNewThing = true;
    this.thingModel = <Thing>{};    
    return this.thingModel;
  }

  private saveSuccessHelper(res) {  
    this.notifyService.showSuccess('Channel created successfully','Success'); 
  }
  private saveFailedHelper(error: any) {
    this.notifyService.showError('Something went wrong','Error'); 
  }

   channelRandomName(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  

}
