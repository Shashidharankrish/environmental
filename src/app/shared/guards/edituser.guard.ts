import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '@shared/services/user.service';
import { NotificationService } from '@shared/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class EdituserGuard implements CanActivate {
  userDetails: any;
  constructor(private userService: UserService, private router: Router, private notifyService: NotificationService) { }

  canActivate() {
    if (this.userService.isLoggedIn()) {
      this.userDetails = this.userService.getUserPayload();
      if (this.userDetails.role.privilegeCtrl.usersCtrl.edit === 1) {
        return true;
      } else {
        this.notifyService.showError('You are not authorized', 'Error');
        this.router.navigateByUrl('/dashboard')
      }
    }
  }
}
