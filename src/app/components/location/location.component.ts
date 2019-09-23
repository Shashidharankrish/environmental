import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AddEditLocationComponent } from '../add-edit-location/add-edit-location.component';
import { Location } from 'app/models/location.model';
import { LocationService } from '@shared/services/location.service';
import { NotificationService } from '@shared/services/notification.service';
import { AlertService } from '@shared/services/alert.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  rows;
  columns: any[] = [];
  editedLocation: Location;
  sourceLocation: Location;
  editingThingName: { name: string };

  @ViewChild('actionsTemplate') actionsTemplate: TemplateRef<any>;
  @ViewChild('locationEditor') locationEditor: AddEditLocationComponent;
  @ViewChild('editorModal') editorModal: ModalDirective;

  constructor(
    private locationservice: LocationService,
    private notifyService: NotificationService,
    private alertService: AlertService
    ) { }

  ngOnInit() {
    this.columns = [
      // { prop: '_id', name: 'Location Id', width: 370 },
      { prop: 'locationName', name: 'Location Name' },
      {prop:'parentLocName', name:'Parent Location Name'}
    ];
    
    this.columns.push({
      name: 'Action', width: 130,
      cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false
    });

    this.locationservice.getLocations().subscribe(
      res => {
        console.log(res)
        if (res['status'] == true) {
          this.rows = res['list'];
        } 
      });
    
  }

  newLocation(){
    this.editingThingName = null;
    this.sourceLocation = null;
    this.editedLocation = this.locationEditor.newLocation();
    this.editorModal.show();
  }

  editLocation(location){
    this.editingThingName = { name: location.locationName };
    this.sourceLocation = location;
    this.editedLocation = this.locationEditor.editLocation(location);
    if(this.editedLocation){
      this.editorModal.show();
    }
    
  
  }

  delete(location) {
    this.alertService.confirm('Please confirm', 'Do you really want to Delete... ?')
      .then((confirmed) => {
        if (confirmed) {
          this.deletehelper(location);
        }
      })

  }

  deletehelper(location) {
    this.locationservice.deleteLocation(location)
      .subscribe(res => {
        if (res['status'] == true) {
          this.notifyService.showSuccess(res['message'], 'Success');
          this.rows = this.rows.filter(item => item._id != location._id);
        }else if(res['status'] == false){
          this.notifyService.showSuccess(res['message'], 'Success');
        }

      });
  }
  ngAfterViewInit() {

    this.locationEditor.changesSavedCallback = () => {
      this.editorModal.hide();
      this.locationservice.getLocations().subscribe(
        res => {
          if (res) {
            this.rows = res['list'];
          } else if (res['status'] == true) {
            this.rows = res['list'];
          }
        },
        err => {
          this.notifyService.showError(err, 'Error');
        }
      );
    };

    this.locationEditor.changesCancelledCallback = () => {

      this.editedLocation = null;
      this.sourceLocation = null;
      this.editorModal.hide();
    };
  }

  onEditorModalHidden() {
    this.editingThingName = null;
    this.locationEditor.resetForm();
  }



}
