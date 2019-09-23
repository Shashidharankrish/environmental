import { Component, OnInit } from '@angular/core';
import { CommonService } from '../shared/services/common.service';
import { UserService } from '@shared/services/user.service';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  role: any;
  subUser: any[];
  subSide: any[];
  subDevice: any[];
  sidebarItems = [];
  subLocation: any[];
  configurationItem: any[];
  addEnabled: boolean;
  userdetails: any;
  currentUrl: any;
  constructor(public cmnSrv: CommonService, private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }
  ngOnInit() {
    this.getUserRole();
    this.setView()


    $(document).on("click", "a[href='/admin/users'],a[href='/admin/adduser'],a[href='/admin/userrole']", function () {
      //console.log('first child event');
      $('#User').addClass('show');
      $("a[href='#Device'],a[href='#Location'").addClass('collapsed');
      $('#Device,#Location').removeClass('show');
    });

    $(document).on("click", "a[href='/admin/devices'],a[href='/admin/adddevice']", function () {
      // console.log('third child event');
      $('#Device').addClass('show');
      $("a[href='#User'],a[href='#Location'").addClass('collapsed');
      $('#User,#Location').removeClass('show');
    });

    $(document).on("click", "a[href='/admin/Location']", function () {
      // console.log('third child event');
      $('#Location').addClass('show');
      $("a[href='#User'],a[href='#Device'").addClass('collapsed');
      $('#User,#Device').removeClass('show');
    });


    $(document).on("click", "a[href='#User']", function () {
      // console.log('third child event');
      $('#User').addClass('show');
      $("a[href='#Device'],a[href='#Location']").addClass('collapsed');
      $('#Device,#Location').removeClass('show');
    });

    $(document).on("click", "a[href='#Device']", function () {
      // console.log('third child event');
      $('#Device').addClass('show');
      $("a[href='#User'],a[href='#Location']").addClass('collapsed');
      $('#User,#Location').removeClass('show');
    });

    $(document).on("click", "a[href='#Location']", function () {
      // console.log('third child event');
      $('#Location').addClass('show');
      $("a[href='#User'],a[href='#Device'").addClass('collapsed');
      $('#User,#Device').removeClass('show');
    });
    /* page onload validate function */

    $(document).ready(function () {
      if ($('#Configuration .sidebar-sub-item.active a').attr("href") == "#User") {
        $('#User').addClass('show');
        $("a[href='#Device'],a[href='#Location']").addClass('collapsed');
        $('#Device,#Location').removeClass('show');
      }
      
      else if ($('#Configuration .sidebar-sub-item.active a').attr("href") == "#Device") {
        $('#Device').addClass('show');
        $("a[href='#User'],a[href='#Location']").addClass('collapsed');
        $('#User,#Location').removeClass('show');
      }

      else if ($('#Configuration .sidebar-sub-item.active a').attr("href") == "#Location") {
        // console.log('third child event');
        $('#Location').addClass('show');
        $("a[href='#User'],a[href='#Device'").addClass('collapsed');
        $('#User,#Device').removeClass('show')
      }
    });
  }




  getUserRole() {
    this.userdetails = this.userService.getUserPayload();
    this.role = this.userdetails.role;
  }
  setView() {
    this.sidebarItems = [
      {
        link: '/admin/dashboard-main', label: 'Dashboard', icon: 'dashboard'
      }]
    this.configurationItem = []
    if (this.role['privilegeCtrl']['usersCtrl']['list'] === 1 && this.role['privilegeCtrl']['devicesCtrl']['list'] === 1) {
      this.sidebarItems.push({ label: 'Configuration', icon: 'phonelink_setup', subItem: this.configurationItem })
    }
    this.subUser = [];
    if (this.role['privilegeCtrl']['usersCtrl']['list'] === 1 || this.role['privilegeCtrl']['usersCtrl']['add'] === 1) {
      this.configurationItem.push({ label: 'User', icon: 'account_circle', subItem: this.subUser })
      if (this.role['privilegeCtrl']['usersCtrl']['list'] === 1) {
        this.subUser.push({ link: '/admin/users', label: 'User List', icon: 'filter_none' },
          { link: '/admin/edituser', label: 'Edit user', icon: 'filter_none' })
      }
      if (this.role['privilegeCtrl']['usersCtrl']['add'] === 1) {
        this.subUser.push({ link: '/admin/adduser', label: 'Add User', icon: 'group_add' })
      }
      if (this.role['privilegeCtrl']['usersCtrl']['role'] === 1) {
        this.subUser.push({ link: '/admin/userrole', label: 'User Role', icon: 'group_add' })
      }
    }

    this.subDevice = [];
    if (this.role['privilegeCtrl']['devicesCtrl']['list'] === 1 || this.role['privilegeCtrl']['devicesCtrl']['add'] === 1) {
      this.configurationItem.push({ label: 'Device', icon: 'devices', subItem: this.subDevice })

      if (this.role['privilegeCtrl']['devicesCtrl']['list'] === 1) {
        this.subDevice.push({ link: '/admin/devices', label: 'Device List', icon: 'storage' })
      }
      if (this.role['privilegeCtrl']['devicesCtrl']['add'] === 1) {
        this.subDevice.push({ link: '/admin/adddevice', label: 'Add Device', icon: 'add_comment' })
      }
    }

    this.subLocation = [];
    if (this.role['privilegeCtrl']['locationsCtrl']['list'] === 1 || this.role['privilegeCtrl']['locationsCtrl']['add'] === 1) {
      this.configurationItem.push({ label: 'Location', icon: 'devices', subItem: this.subLocation })
    }
    if (this.role['privilegeCtrl']['locationsCtrl']['list'] === 1) {
      this.subLocation.push({ link: '/admin/location', label: 'All Location', icon: 'add_comment' })
    }
    // if (this.role['privilegeCtrl']['usersCtrl']['list'] === 1 && this.role['privilegeCtrl']['devicesCtrl']['list'] === 1) {
    //   this.sidebarItems.push({ label: 'Configuration', icon: 'phonelink_setup', subItem: this.configurationItem })
    // }
    this.sidebarItems.push({ link: '/admin/moresearch', label: 'More Search', icon: 'search' })

  }
}
