import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '@shared/services/user.service';
import { NgForm, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@shared/services/notification.service';
import { LowerCasePipe } from '@angular/common';
import { LocationService } from '@shared/services/location.service';
import { UserEdit } from 'app/models/UserEdit';

@Component({
  selector: 'app-edituseruser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.scss']
})
export class EditUserComponent implements OnInit {
  checked = false;
  indeterminate = false;
  showSucessMessage: boolean;
  serverErrorMessages: string;
  //roles:any[];
  allRoles: any[];
  userid: string;
  loweCasePipe: LowerCasePipe = new LowerCasePipe();
  allLocations: any[];
  userEdit: UserEdit = { 
   email: '',
   firstName: '',
   lastName: '',
   roles: [],
   locations:[]
 };
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private notifyService: NotificationService,
    private locationService: LocationService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userService.edituser(params['userid']).subscribe(res => {

        this.userid = res['user']._id;
        this.userEdit.firstName = res['user'].first_name;
        this.userEdit.lastName = res['user'].last_name;
        this.userEdit.email = res['user'].email;
        this.userEdit.roles = res['user'].role;
        this.userEdit.locations = res['user'].default_location;
      });
    });
    this.getAllUserRoles();
  }

  getAllUserRoles() {
    this.userService.getAllUserRoles().subscribe(roles => {
      this.allRoles = roles['list'];
      this.locationService.getParentLocations().subscribe(locations => {
        this.allLocations = locations['list']
      })
    });
  }

  onSubmit(form: NgForm) {
    let loweCaseEmail = this.loweCasePipe.transform(form.value.email);
    form.value.email = loweCaseEmail;
    form.value.email.trim();


    this.userService.updateuser(form.value, this.userid).subscribe(
      res => {
        if (res['status'] == false) {
          this.serverErrorMessages = res['message'];
          this.notifyService.showError(res['message'], 'Error');
        } else if (res['status'] == true) {
          this.router.navigate(['/admin/users']);
          this.notifyService.showSuccess('User saved successfully', 'Success');
          this.resetForm(form);
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

  resetForm(form: NgForm) {
    this.userService.selectedAdmin = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      roles: [],
      locations: []
    };
    form.resetForm();
    this.serverErrorMessages = '';
  }
}
