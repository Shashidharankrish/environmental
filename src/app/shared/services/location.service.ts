import { Injectable } from '@angular/core';
import { Thing } from '../../models/thing.model';
import { Observable,Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpResponse ,  HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Channel } from 'app/models/channel.model';
import { Device } from '../../models/device.model';
import { Location } from '../../models/location.model';
@Injectable({
  providedIn: 'root'
})
export class LocationService {
  
  constructor(private http: HttpClient) { }


  /*getAllLocations(){
    return this.http.get(environment.apiBaseUrl + '/all_location');
  }*/
  
  createThing(location: Location):  Observable<any> {
      return this.http.post(environment.apiBaseUrl + '/adddevice', JSON.stringify(location)).pipe(
        catchError(error => {
          return this.handleError(error);
        }));
  }
  updateThing(location: Location):  Observable<any> {
   return this.http.put(environment.apiBaseUrl+ '/update_device/' + location.id, location).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }
 
  deleteThing(location): any {
    return this.http.delete(environment.apiBaseUrl+ '/delete_device/' + location._id).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }
  
  getThings() {
    return this.http.get(environment.apiBaseUrl + '/all_devices').pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }
  

  

  handleError(error){
    return throwError(error);
  }

 

  getLocations() {
    return this.http.get(environment.apiBaseUrl + '/all_location').pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }

  getAvailableLocations() {
    return this.http.get(environment.apiBaseUrl + '/get_available_locations').pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }

  getParentLocations() {
    return this.http.get(environment.apiBaseUrl + '/parentlocation').pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }

  getSubLocations() {
    return this.http.get(environment.apiBaseUrl + '/sublocation').pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }

  getSubLocationAvgInfo(locationId) {
    return this.http.get(environment.apiBaseUrl + '/get_level_of_locations/' + locationId).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }

  getLocationDetails(locationId) {
    return this.http.get(environment.apiBaseUrl + '/location/' + locationId).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }

  createLocation(location: Location): Observable<any>  {
    return this.http.post(environment.apiBaseUrl + '/add_location', JSON.stringify(location)).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }

  updateLocation(location): Observable<any> {
    return this.http.put(environment.apiBaseUrl+ '/update_location/' + location.id, location).pipe(
       catchError(error => {
         return this.handleError(error);
       }));
   }

   deleteLocation(thingModel): Observable<any> {
    return this.http.delete(environment.apiBaseUrl+ '/location/' + thingModel._id).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }

}
