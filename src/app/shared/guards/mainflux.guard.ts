import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from "@shared/services/user.service";
import { Router } from "@angular/router";
import { NotificationService } from '@shared/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class MainFluxGuard implements CanActivate {

  constructor(private userService : UserService,private router : Router, private notifyService: NotificationService){}

  canActivate() {
      if (!this.userService.isMainfluxLoggedIn()) {
        this.notifyService.showError('You are not a valid user','Error');
        return false;
      }
    return true;
  }
}
