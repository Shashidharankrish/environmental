import { Component, OnInit } from '@angular/core';
import { UserService } from '@shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@shared/services/notification.service';
import { LowerCasePipe } from '@angular/common';
import { CommonService } from '@shared/services/common.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  PasswordError: boolean;
  userError: boolean;
  toggleFormClass;
  returnUrl: string;
  userForm: FormGroup;
  submitted = false;
  serverErrorMessages: string;
  lowerCasePipe:LowerCasePipe=new LowerCasePipe();
  constructor(private router: Router,
    public cmnSrv: CommonService,
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private notifyService: NotificationService ) {
  }

  ngOnInit() {
    if (this.userService.isLoggedIn())
      this.router.navigateByUrl('/admin/dashboard');
      this.buildForm();
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  buildForm() {
    this.userForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'password': ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25)
      ]
      ],
    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {

  }

  get f() { return this.userForm.controls; }
  login() {
    let userName=this.lowerCasePipe.transform(this.userForm.value.email);
    this.userForm.value.email=userName;
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    this.userService.login(this.userForm.value).subscribe(
      res => {
        if (res['status'] == false) {
          this.serverErrorMessages = res['message'];
          this.notifyService.showError( res['message'],'Error');
        } else if(res['status'] == true){
          this.userService.setTokenData(res);
          console.log(res)
          let data = {locationid: res['user'].default_location };
          //this.cmnSrv.changeMessage(data);
          // if (res['user'].mainfluxemail && res['user'].mainfluxpass) {
          //   this.userService.mainfluxlogin(res['user'].mainfluxemail, res['user'].mainfluxpass).subscribe(
          //     response => {
          //       const accessToken = response.token;
          //       if (accessToken == null) {
          //         throw new Error('Received accessToken was empty');
          //       } else {
          //         localStorage.setItem('mainfluxtoken', accessToken)
          //       }
          //     },
          //     err => {
          //       this.serverErrorMessages = err.error.message;
          //     }
          //   );
          // }
          this.router.navigate([ '/admin/dashboard-main/' ], { queryParams: { "locationid": data.locationid } } );
          //this.router.navigateByUrl('/dashboard');
        }            
      },
      err => {
        console.log(err)
        //this.serverErrorMessages = err.error.message;
      }
    );
  }

  showSignUp() {
    this.toggleFormClass = 'bounceLeft';
  }

  showLogin() {
    this.toggleFormClass = 'bounceRight';
  }


}
