import { Injectable, Injector } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoaderService } from '@shared/services/loader.service';
import { UserService } from '@shared/services/user.service';
import { NotificationService } from '@shared/services/notification.service';

@Injectable() 
export class HttpConfigInterceptor implements HttpInterceptor { 
  userdetails:any;
    constructor(private loaderService: LoaderService,private notifyService: NotificationService, private injector: Injector) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const userservice = this.injector.get(UserService);
        if(userservice.isLoggedIn()){
          this.userdetails = userservice.getUserPayload();
          var userid: string = this.userdetails._id;
            if (userid) {
              request = request.clone({ headers: request.headers.set('auth-uid',  userid) });
            }
        }
        
       

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }
        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        this.showLoader();
        return next.handle(request).pipe(
            map( (event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    this.onEnd();
                    //console.log('event--->>>', event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                this.onEnd();
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) {
                  console.log(error)
                  // client-side errors
                  errorMessage = `Error: ${error.error.message}`;
                  this.notifyService.showError(errorMessage,'Error');
                } else { console.log(error)
                  // server-side error
                 // errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                 if(error.status == 0){
                  errorMessage = "No Network: The server cannot be reached.";
                 } else if(error.status == 403){
                  errorMessage = "Access Denied!";
                 } else if(error.status == 404){
                  errorMessage = "Not Found Error!";
                 }
                  this.notifyService.showError(errorMessage,'Error');
                }
                //window.alert(errorMessage);
                return throwError(errorMessage);
              }));
    }
    private onEnd(): void {
        this.hideLoader();
      }
      private showLoader(): void {
        this.loaderService.show();
      }
      private hideLoader(): void {
        this.loaderService.hide();
      }

}