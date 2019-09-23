import { Injectable } from '@angular/core';
import { Thing } from '../../models/thing.model';
import { Observable,Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpResponse ,  HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Channel } from 'app/models/channel.model';
import { Device } from '../../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class ThingService {
  
  private readonly _thingUrl: string = '/things';
  public baseUrl = environment.mainfluxapiUrl;
  get thingUrl() { return this.baseUrl + this._thingUrl; }

  private readonly _channelUrl: string = '/channels';
  get channelUrl() { return this.baseUrl + this._channelUrl; }

  constructor(private http: HttpClient) { }

  getThings() {
    return this.http.get(environment.apiBaseUrl + '/all_devices');
  }
  getThing(id: string): any {
    const endpointUrl =  `${this.thingUrl}/${id}`;
    return this.http.get(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }
  createThing(thing: Thing): any {
    const endpointUrl =    `${this.thingUrl}`;
    const headers = this.getRequestHeadersPlain();
    const options = {
      headers: headers,
      observe: 'response' as 'body'
  };
    return this.http.post(endpointUrl, JSON.stringify(thing), options ).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }
  updateThing(thing: Thing): any {
   return this.http.put(environment.apiBaseUrl+ '/update_device/' + thing.id, thing).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }
  updateThingMainflux(thing: Thing): any {
    thing.type = "device";
    const endpointUrl =    `${this.thingUrl}/${thing.id}`;
    return this.http.put(endpointUrl, JSON.stringify({'name': thing.name, 'type': thing.type}), this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }
  deleteThing(thingModel): any {
    return this.http.delete(environment.apiBaseUrl+ '/delete_device/' + thingModel.mfDeviceId).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }
  
  deleteThingMainflux(thingModel: Thing): any {
    const endpointUrl =    `${this.thingUrl}/${thingModel.id}`;
    return this.http.delete(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }

  protected getRequestHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } {
    const accesstoken = localStorage.getItem('mainfluxtoken');
    let headers = new HttpHeaders({
      'Authorization':  accesstoken,
      'Content-Type': 'application/json',
      'Accept': `application/json, text/plain, */*`,
    });

    return { headers: headers };
  }

  protected getRequestHeadersPlain(): HttpHeaders {
    const accesstoken = localStorage.getItem('mainfluxtoken');
    let headers = new HttpHeaders({
      'Authorization':  accesstoken,
      'Content-Type': 'application/json',
      'Accept': `application/json, text/plain, */*`,
    });

    return headers;
  }

  getDeviceStatus(deviceinfo):Observable<any> 
  {
    return this.http.put(environment.apiBaseUrl + '/check_device_status', deviceinfo);
  }
  handleError(error){
    return throwError(error);
  }

  saveDeviceDb(device: Device){
    return this.http.post(environment.apiBaseUrl + '/adddevice', device).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }

}
