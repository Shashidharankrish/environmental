import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Pager } from 'app/models/pager.model';
import { ThingService } from '../../shared/services/thing.service';
import { Thing } from 'app/models/thing.model';
import { AddThingsComponent } from './add-things.component';
import { NotificationService } from '@shared/services/notification.service';
import { AlertService } from '@shared/services/alert.service';
import { UserService } from '@shared/services/user.service';
import { LocationService } from '@shared/services/location.service';

@Component({
  selector: 'app-things-list',
  templateUrl: './things-list.component.html',
  styleUrls: ['./things-list.component.css']
})
export class ThingsListComponent implements OnInit, AfterViewInit {
  role: any[];
  rows;
  columns: any[] = [];
  things: Thing[] = [];
  editedThing: Thing;
  sourceThing: Thing;
  editingThingName: { name: string };
  itemsPerPage = 5;
  pager: Pager;
  userdetails: any;
  @ViewChild('actionsTemplate') actionsTemplate: TemplateRef<any>;
  @ViewChild('thingEditor') thingEditor: AddThingsComponent;
  @ViewChild('editorModal') editorModal: ModalDirective;
  constructor(
    private thingservice: ThingService,
    private notifyService: NotificationService,
    private alertService: AlertService,
    private userService: UserService,
    private locationservice: LocationService) { }

  ngOnInit() {
    this.getUserRole()
    this.columns = [
      { prop: 'deviceName', name: 'Device Name' },
      { prop: 'mfDeviceId', name: 'Device Id', width: 370 },
      { prop: 'deviceLocation.locationName', name: 'Location'},
      { prop: 'mfKey', name: 'Device Key', width: 370 },
      // { prop: 'mfChannelId', name: 'Channel Id', width: 370 },
      
    ];
    if (this.deleteEnabled() || this.editEnabled()) {
      this.columns.push({
        name: 'Action', width: 130,
        cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false
      });
    }
      this.locationservice.getThings().subscribe(
        res => {
          if (res) {
            this.rows = res['list'];
          } else if (res['status'] == true) {
            this.rows = res['list'];
          }
        },
        err => {
          if (err.status === 422) {

          }
        }
      );
    
  }

  editThing(thing) {
    this.editingThingName = { name: thing.deviceName };
    this.sourceThing = thing;
    this.editedThing = this.thingEditor.editThing(thing);
    this.editorModal.show();
  }

  onEditorModalHidden() {
    this.editingThingName = null;
    this.thingEditor.resetForm();
  }

  delete(thing: Thing) {
    this.alertService.confirm('Please confirm', 'Do you really want to Delete... ?')
      .then((confirmed) => {
        if (confirmed) {
          this.deletehelper(thing);
        }
      })

  }

  deletehelper(thing) {
    this.locationservice.deleteThing(thing)
      .subscribe(res => {
        if (res['status'] == true) {
          this.notifyService.showSuccess("Device deleted successfully", 'Success');
          this.rows = this.rows.filter(item => item !== thing);
        }

      });
  }

  ngAfterViewInit() {

    this.thingEditor.changesSavedCallback = () => {
      this.editorModal.hide();
      this.locationservice.getThings().subscribe(
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

    this.thingEditor.changesCancelledCallback = () => {

      this.editedThing = null;
      this.sourceThing = null;
      this.editorModal.hide();
    };
  }
  getUserRole() {
      this.userdetails = this.userService.getUserPayload();  
      this.role = this.userdetails.role;   
  }

  addEnabled() {
    if (this.role['privilegeCtrl']['devicesCtrl']['add'] == 1) {
      return true;
    }
  }

  deleteEnabled() {
    if (this.role['privilegeCtrl']['devicesCtrl']['delete'] == 1) {
      return true;
    }

  }
  editEnabled() {
    if (this.role['privilegeCtrl']['devicesCtrl']['edit'] == 1) {
      return true;
    }
  }

}
