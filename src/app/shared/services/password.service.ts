import { Injectable } from '@angular/core';
import { Password } from '../../models/password.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserService } from '@shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  passwordFormat: Password = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  }
  userdetails:any;

  constructor(private http: HttpClient,private userService: UserService) { }
  changePassword(form:Password) {
    this.userdetails = this.userService.getUserPayload();
    let userID = this.userdetails._id;
    return this.http.put(environment.apiBaseUrl + '/change_pass/' + userID,form)
  }
}
