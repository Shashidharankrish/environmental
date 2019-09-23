import { Component, OnInit } from '@angular/core';
import { Password } from '../../models/password.model';
import { PasswordService } from '@shared/services/password.service';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '@shared/services/notification.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  wrongPassword: boolean = false;
  checked = false;
  indeterminate = false;
  showSucessMessage: boolean;
  serverErrorMessages: string;
  changePasswordForm: FormGroup;
  submitted: boolean = false;
 

  constructor(
    private passwordService: PasswordService,
    private notifyService: NotificationService, 
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.submitted = false;
    this.changePasswordForm = this.formBuilder.group({
      current_password: ['', [Validators.required]],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]],
    }, {
      validator: this.MustMatch('new_password', 'confirm_password')
  });
  }

   MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}


  get f() { return this.changePasswordForm.controls; }
  onSubmit() {
    this.submitted = true;

    if(this.changePasswordForm.valid){
      this.passwordService.changePassword(this.changePasswordForm.value).subscribe(res => {

        if (res['status'] == false) {
          this.notifyService.showError(res['message'], 'Error');
  
          return;
        } else if (res['status'] == true) {
          this.resetForm();
          this.notifyService.showSuccess('password update successfully', 'Success');
          this.router.navigate(['/dashboard']);
        }
        err => {
          if (err.status === 422) {
            this.notifyService.showError(err['message'], 'Error');
          }
          else
            this.notifyService.showError('Something went wrong', 'Error');
        }
      });
    }


  }
  resetForm() {
    this.changePasswordForm.reset();

  }

}
