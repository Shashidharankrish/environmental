import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient) { }
  getAllDevices(): Observable<any> {
    return this.http.get(environment.apiBaseUrl + '/all_devices');
  }

  getDeviceByLocation(location_id) {
    return this.http.get(environment.apiBaseUrl + '/device_by_location/'+location_id);
  }  

}
