import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { UserService } from '@shared/services/user.service';
import { UserRoleService } from '@shared/services/userrole.service';
import { Router } from '@angular/router';
import { NotificationService } from '@shared/services/notification.service';

@Component({
  selector: 'app-userrole',
  templateUrl: './userrole.component.html',
  styleUrls: ['./userrole.component.scss']
})
export class UserroleComponent implements OnInit {
  public role: any;
  public form: FormGroup;
  userRoleForm: FormGroup;
  items: FormArray;
  pages:any[];
  firstcontrol:any[];
  objectKeys = Object.keys;
  labels: any;
  countries: string[] = ['USA', 'UK', 'Canada'];
  roles: any;
  privilege: any;
  constructor(
    private userService: UserService,
    private userRoleService: UserRoleService,
    private notifyService: NotificationService,
    private router: Router,
    private formBuilder: FormBuilder) {
    
     }

  ngOnInit() {
    this.getAllPages();
     
  }


  getAllPages() {
    this.userRoleService.getAllPages().subscribe(pages => {           
      this.pages = pages['list'];
      this.initform(); 
      this.getUserRoles(); 
    });
  }

  initform(){
    
    var pages = {}; 
    this.labels = {};
    for(let i in this.pages) {
      const page = this.pages[i];
      this.labels[page.ctrlName] = {name : page.pageName, action: {}};
      var controls = {};
      for (var key in page['actionCtrl']) {
        controls[key] = new FormControl();
        this.labels[page.ctrlName]['action'][key] = page['actionCtrl'][key];
        
      }
      pages[page.ctrlName] = new FormGroup(controls);

    }
    pages['userole'] = new FormControl();
    this.userRoleForm = this.formBuilder.group(pages);
  }

  save(){
    this.userRoleService.updateuserRole(this.userRoleForm.value,this.userRoleForm.get('userole').value).subscribe(
      res => {
        if(res['status'] == false){
         this.notifyService.showError( res['message'],'Error'); 
        }else if(res['status'] == true){
          this.router.navigate(['/admin/userrole']);
          this.notifyService.showSuccess('User Role updated successfully','Success'); 
         
        } 
      },
      err => {
        if (err.status === 422) {
        }
        else
        this.notifyService.showError('Something went wrong','Error'); 
      }
    );
  }

  getUserRoles(){
    this.userRoleService.getAllUserRoles().subscribe(res => {      
      this.roles = res['list'];
    });
  }

  

  onChange(deviceValue) {    
    this.getUserRoleById(deviceValue);
  }

  getUserRoleById(userid = '5cc03d95e7179a274e08678f'){
    this.userRoleService.getUserRoleById(userid).subscribe(res => { 
      this.privilege = res['list'];
      this.userRoleForm.patchValue(this.privilege.privilegeCtrl)
      //this.initFormGroup(this.userRoleForm,this.privilege.privilegeCtrl);
    });
  }

  initFormGroup(userRoleForm: FormGroup, data) {
    console.log(this.userRoleForm.controls)
    Object.keys(this.userRoleForm.controls).forEach(key => {
      var control = this.userRoleForm.get(key);
      //console.log(control)
      if(control instanceof FormControl){
        console.log('fc');
      }else{
        var allcontrols = control['controls'];
        for( let ctrl in allcontrols){
            console.log(ctrl)
        }
        
      }
      
    });
   
  }


}
