import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getAllCounts(): Observable<any> {
    return this.http.get(environment.apiBaseUrl + '/dash_board');
  }

  getLocationAvgInfo(locationid, unittype): Observable<any> {
    return this.http.get(environment.apiBaseUrl + '/get_location_avg_deviceinfo/' + locationid + '/' + unittype);
  }

  getLocationAllInfo(locationid, unittype, sDate?, eDate?): Observable<any> {
    if(sDate == 'Invalid date' || sDate == undefined) sDate = 'no_date';
    if(eDate == 'Invalid date' || eDate == undefined) eDate = 'no_date';
    return this.http.get(environment.apiBaseUrl + '/get_location_all_deviceinfo/' + locationid + '/' + unittype + '/' + sDate + '/' + eDate);
  }

  getDeviceInfo(locationid, unittype): Observable<any> {
    return this.http.get(environment.apiBaseUrl + '/get_devicesinfo_mf/' + locationid + '/' + unittype);
  }

  search(queryString: string) {
    let _URL = environment.apiBaseUrl + queryString;
    return this.http.get(_URL);
  }

  getParameters() {
    return this.http.get(environment.apiBaseUrl + '/parameters');
  }

}
