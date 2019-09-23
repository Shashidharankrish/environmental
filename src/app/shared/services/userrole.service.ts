import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { Admin } from '../../models/admin.model';
import { UserEdit } from 'app/models/UserEdit';
import { LoginResponse } from 'app/models/login-response.model';
@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  selectedUser: User = {
    email: '',
    password: '',
    firstName: '',
    lastName:''
  };

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient) { }

  //HttpMethods

  addUser(user: Admin) {
    return this.http.post(environment.apiBaseUrl + '/adduser', user, this.noAuthHeader);
  }
  edituser(userid) {
    return this.http.get(environment.apiBaseUrl + '/edituser/' + userid);
  }
  updateuser(user: Admin, userid) {
    return this.http.put(environment.apiBaseUrl + '/updateuser/' + userid, user);
  }
  postUser(user: User) {
    return this.http.post(environment.apiBaseUrl + '/register', user, this.noAuthHeader);
  }

  login(authCredentials) {
    return this.http.post(environment.apiBaseUrl + '/login', authCredentials, this.noAuthHeader);
  }
  mainfluxlogin(userName, password) {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const loginObject = {'email': userName, 'password': password };
    return this.http.post<LoginResponse>(environment.mainfluxapiUrl+ '/tokens', JSON.stringify(loginObject), { headers: header });
  }
  getUserProfile() {
    return this.http.get(environment.apiBaseUrl + '/userProfile');
  }

  getAllPages() {
    return this.http.get(environment.apiBaseUrl + '/all_page');
  }

  deleteUser(userid){
    return this.http.delete(environment.apiBaseUrl + '/user/' + userid);
  }
  //Helper Methods

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getMainfluxToken() {
    return localStorage.getItem('mainfluxtoken');
  }

  setTokenData(res) {
    localStorage.setItem('firstname',res['user'].first_name);
    localStorage.setItem('lastname',res['user'].last_name);
    this.setToken(res['token']);
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

  getAllUserRoles(){
    return this.http.get(environment.apiBaseUrl + '/all_role/');
  }

  getUserRoleById(userid){
    return this.http.get(environment.apiBaseUrl + '/get_role_byid/' + userid);
  }

  updateuserRole(user, userroleid) {
    return this.http.put(environment.apiBaseUrl + '/update_role/' + userroleid, user);
  }

}
