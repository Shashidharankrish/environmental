import { Component, OnInit } from '@angular/core';
import { UserService } from '@shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { NotificationService } from '@shared/services/notification.service';
import { LowerCasePipe } from '@angular/common';
import * as $ from 'jquery';
import {  FileUploader, Headers  } from 'ng2-file-upload/ng2-file-upload';
import { environment } from 'environments/environment';
import { UserEdit } from 'app/models/UserEdit';

const URL = environment.apiBaseUrl + '/upload';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public authuserid:string;
  userEdit: UserEdit = { 
   email: '',
   firstName: '',
   lastName: '',
   roles: [],
   locations:[]
 };
  constructor(
    private router: Router,
    private userService: UserService, 
    private route: ActivatedRoute, 
    private notifyService: NotificationService) { }
   
  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'photo', authToken: this.userService.getToken() });
  checked = false;
  indeterminate = false;
  showSucessMessage: boolean;
  serverErrorMessages: string;
  allRoles: any[];
  userid: string;
  dontShow: boolean = true;
  loweCasePipe: LowerCasePipe = new LowerCasePipe();
  userdetails:any;
  profileimage:string = 'https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652__340.png';

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = true; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any) => {
         var result =  JSON.parse(response)
         if(result.status == true){
          this.notifyService.showSuccess(result.message,'Success');
         }else{
          this.notifyService.showError(result.message,'Error');
         }
         
         //alert('File uploaded successfully');
     };

    this.userdetails = this.userService.getUserPayload();
    let userID = this.userdetails._id;
    this.userService.edituser(userID).subscribe(res => {
      if (userID === res['user']._id) {
        this.userEdit.firstName = res['user'].first_name;
        this.userEdit.lastName = res['user'].last_name;
        this.userEdit.email = res['user'].email;
        this.userEdit.roles = res['user'].role;
        if(res['user'].imagePath){
          this.profileimage = environment.serverBaseUrl + '/uploads/' + res['user'].imagePath;
        }
        
      }
      this.userid = res['user']._id;
    });
    this.getAllUserRoles();

    /* jquery js code*/
    $(document).ready(function() {

    
      var readURL = function(input) {
          if (input.files && input.files[0]) {
              var reader = new FileReader();
  
              reader.onload = function (e) {
                  $('.profile-pic').attr('src', e.target['result']);
              }
      
              reader.readAsDataURL(input.files[0]);
          }
      }
      
  
      $(".file-upload").on('change', function(){
          readURL(this);
      });
      
      $(".upload-button").on('click', function() {
         $(".file-upload").click();
      });
  });
  }
  getAllUserRoles() {
    this.userService.getAllUserRoles().subscribe(roles => {
      this.allRoles = roles['list'];
    });
  }
  onSubmit(form: NgForm) {
    let loweCasePipe = this.loweCasePipe.transform(form.value.email);
    form.value.email = loweCasePipe;
    form.value.email.trim();
    this.userService.updateuser(form.value, this.userid).subscribe(
      res => {
        if (res['status'] == false) {
          this.serverErrorMessages = res['message'];
        } else if (res['status'] == true) {       
          this.notifyService.showSuccess('Profile updated successfully', 'Success');       
          //this.resetForm(form);
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
    //this.router.navigate(['/dashboard']);
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
