import { Injectable } from '@angular/core';
import { Thing } from '../../models/thing.model';
import { Observable,Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpResponse ,  HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Channel } from 'app/models/channel.model';


@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  
  private readonly _thingUrl: string = '/things';
  public baseUrl = environment.mainfluxapiUrl;
  get thingUrl() { return this.baseUrl + this._thingUrl; }

  private readonly _channelUrl: string = '/channels';
  get channelUrl() { return this.baseUrl + this._channelUrl; }

  constructor(private http: HttpClient) { }

  
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

  
  createChannel(channel): any {
    const endpointUrl =    `${this.channelUrl}`;
    const headers = this.getRequestHeadersPlain();
    const options = {
      headers: headers,
      observe: 'response' as 'body'
  };
    return this.http.post(endpointUrl, JSON.stringify(channel), options ).pipe(
      catchError(error => {
        return this.handleError(error);
      }));

  }

  createMapping(channelId: string, thingId: string): any{
    const endpointUrl =  `${this.channelUrl}/${channelId}/things/${thingId}`;
    return this.http.put(endpointUrl, {}, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }

  handleError(error){
    return throwError(error);
  }

}
