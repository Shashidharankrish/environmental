import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  response: any = {};
  private messageResponse = new BehaviorSubject(this.response);
  currentResponse = this.messageResponse.asObservable();

  dashboardState =  {
    navbarToggle: false,
    sidebarToggle: true,
    sidebarMiniToggle: true
  };

  sidebarToggle(): void {
    this.dashboardState.sidebarToggle = !this.dashboardState.sidebarToggle;
  }

  sidebarMiniToggle(): void {
    this.dashboardState.sidebarMiniToggle = !this.dashboardState.sidebarMiniToggle;
  }

  navbarToggle(): void {
    this.dashboardState.navbarToggle = !this.dashboardState.navbarToggle;
  }

  changeMessage(message: any) {
    this.messageResponse.next(message)
  }

}
