import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { Admin } from '../../models/admin.model';
import { UserEdit } from 'app/models/UserEdit';
import { LoginResponse } from 'app/models/login-response.model';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  selectedUser: User = {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  };
  selectedAdmin: Admin = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    roles: [],
    locations: []
  };
  userEdit: UserEdit = {
    email: '',
    firstName: '',
    lastName: '',
    roles: [],
    locations: []
  };

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient) { }

  addUser(user: Admin) {
    return this.http.post(environment.apiBaseUrl + '/adduser', user, this.noAuthHeader).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }
  edituser(userid) {
    return this.http.get(environment.apiBaseUrl + '/edituser/' + userid).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }
  updateuser(user: Admin, userid) {
    return this.http.put(environment.apiBaseUrl + '/updateuser/' + userid, user).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }
  activateuser(user, userid) {
    return this.http.put(environment.apiBaseUrl + '/activate_user/' + userid, user).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }
  postUser(user: User) {
    return this.http.post(environment.apiBaseUrl + '/register', user, this.noAuthHeader).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }

  login(authCredentials) {
    return this.http.post(environment.apiBaseUrl + '/login', authCredentials, this.noAuthHeader).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }
  mainfluxlogin(userName, password) {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const loginObject = { 'email': userName, 'password': password };
    return this.http.post<LoginResponse>(environment.mainfluxapiUrl + '/tokens', JSON.stringify(loginObject), { headers: header }).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }
  getUserProfile() {
    return this.http.get(environment.apiBaseUrl + '/userProfile').pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }

  getAllUser(): Observable<any> {
    return this.http.get(environment.apiBaseUrl + '/alluser').pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }

  getAllSecUser(): Observable<any> {
    return this.http.get(environment.apiBaseUrl + '/all_sec_user').pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }

  deleteUser(userid) {
    return this.http.delete(environment.apiBaseUrl + '/user/' + userid).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }
  //Helper Methods
  getPrivilege(){
    return localStorage.getItem('privilege');
  }
  setPrivilege(role: any) {
    localStorage.setItem('privilege', JSON.stringify(role));
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getMainfluxToken() {
    return localStorage.getItem('mainfluxtoken');
  }

  setTokenData(res) {
    this.setToken(res['token']);
  }

  setPrivilegeData(res) {
    this.setPrivilege(res['user'].role);
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }

  getAllUserRoles() {
    return this.http.get(environment.apiBaseUrl + '/all_role/');
  }

  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload)
      return true;
    else
      return false;
  }

  isMainfluxLoggedIn() {
    if (this.getMainfluxToken()) {
      return true;
    } else {
      return false;
    }
  }
  handleError(error){
    return throwError(error);
  }
}
