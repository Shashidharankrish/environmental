import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '@shared/services/user.service';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '@shared/services/notification.service';
import { AlertService } from '@shared/services/alert.service';
import { LocationService } from '@shared/services/location.service';
@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AddUserComponent implements OnInit {
  checked = false;
  indeterminate = false;
  showSucessMessage: boolean;
  serverErrorMessages: string;
  allRoles: any[];
  signUpForm: FormGroup;
  submitted = false;
  allLocations: any[];
  parent_locations : any[]
  constructor(
    private userService: UserService,
    private router: Router,
    private notifyService: NotificationService,
    private alertService: AlertService,
    private locationService: LocationService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.submitted = false;
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      roles: [[], Validators.required],
      locations: [[], Validators.required]
    })
    this.getAllUserRoles();
    this.getAllLocations();
  }
  get f() { return this.signUpForm.controls; }

  getAllUserRoles() {
    this.userService.getAllUserRoles().subscribe(roles => {
      this.allRoles = roles['list'];
    });
  }
  getAllLocations(){
    this.locationService.getParentLocations().subscribe(locations =>{
      this.allLocations = locations['list']
     })
  }
  onSubmit() {
    this.submitted = true;

    if (this.signUpForm.invalid) {
      return;
    }
    this.signUpForm.value.email = this.signUpForm.value.email.trim();
    this.userService.addUser(this.signUpForm.value).subscribe(
      res => {
        if (res['status'] == false) {
          this.notifyService.showError(res['message'], 'Error');
          if(res['ex_uid'] != 0 ){
            this.alertService.confirm('Please confirm.', 'Do you want to activate user?')
            .then((confirmed) => {
              if (confirmed) {
                this.activateUser(res['ex_uid']);
              }
            });
          }
        } else if (res['status'] == true) {
          this.resetForm();
          this.notifyService.showSuccess('User created successfully', 'Success');
          this.router.navigate(['/admin/users']);
        }
      },
      err => {
          this.notifyService.showError(err, 'Error');
      }
    );
  }

  activateUser(userId){
    let user = {status:'active'};
    this.userService.activateuser(JSON.stringify(user), userId).subscribe(
      res => {
        if (res['status'] == false) {
          this.serverErrorMessages = res['message'];
          this.notifyService.showError(res['message'], 'Error');
        } else if (res['status'] == true) {
          this.router.navigate(['/admin/users']);
          this.notifyService.showSuccess('User activated successfully', 'Success');
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
  resetForm() {
    this.submitted = false;
    this.userService.selectedAdmin = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      roles: [],
      locations: []
    };
    this.serverErrorMessages = '';
  }
}
