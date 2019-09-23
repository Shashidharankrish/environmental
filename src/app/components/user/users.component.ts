import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { UserService } from '@shared/services/user.service';
import { NotificationService } from '@shared/services/notification.service';
import { AlertService } from '@shared/services/alert.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  role: any[];
  checked = false;
  indeterminate = false;
  users: any[];
  showSucessMessage: boolean;
  serverErrorMessages: string;
  profileimage: string;
  columns;
  rows;
  userdetails: any;
  @ViewChild('actionsTemplate') actionsTemplate: TemplateRef<any>;
  constructor(private userService: UserService, private notifyService: NotificationService, private alertService: AlertService) { }

  ngOnInit() {
    this.getUserRole()

    this.columns = [
      { prop: 'first_name', name: 'FirstName' },
      { prop: 'last_name', name: 'LastName' },
      { prop: 'email', name: 'Email' },
      { prop: 'role.roleName', name: 'Role' },
      { prop: 'default_location.locationName', name: 'Location' }
    ];
    if (this.deleteEnabled() || this.editEnabled()) {
      this.columns.push({
        name: 'Action', width: 130,
        cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false
      });
    }
    this.profileimage = 'assets/profile.jpg';
    this.userService.getAllUser().subscribe(
      res => {
        if (res['status'] == false) {
          this.serverErrorMessages = res['message'];
        } else if (res['status'] == true) {
          this.rows = res['user'];
        }
      },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        }
        else
          this.serverErrorMessages = 'Something went wrong.Please contact admin.';
      }
    );

  }

  delete(userid) {

    this.alertService.confirm('Please confirm..', 'Do you really want to Delete... ?')
      .then((confirmed) => {
        if (confirmed) {
          this.deletehelper(userid);
        }
      })
  }

  deletehelper(userid) {
    this.userService.deleteUser(userid).subscribe(
      res => {
        if (res['status'] == false) {
          this.notifyService.showError(res['message'], 'Error');
        } else if (res['status'] == true) {
          this.rows = this.rows.filter(item => item._id != userid);
          this.notifyService.showSuccess('Record deleted successfully', 'Success');
        }
      },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        }
        else
          this.notifyService.showError('Something went wrong', 'Error');
      }
    );
  }
  getUserRole() {
    this.userdetails = this.userService.getUserPayload();
    this.role = this.userdetails.role;
  }

  addEnabled() {
    if (this.role['privilegeCtrl']['usersCtrl']['add'] == 1) {
      return true;
    }
  }

  deleteEnabled() {
    if (this.role['privilegeCtrl']['usersCtrl']['delete'] == 1) {
      return true;
    }

  }
  editEnabled() {
    if (this.role['privilegeCtrl']['usersCtrl']['edit'] == 1) {
      return true;
    }
  }
}
