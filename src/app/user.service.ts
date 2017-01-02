import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { UserModel } from './models/user.model';
import { HttpService } from './http.service';

@Injectable()
export class UserService {

  public userEvents = new BehaviorSubject<UserModel>(undefined);

  constructor(private http: HttpService) {
    this.retrieveUser();
  }

  register(login, password, birthYear): Observable<UserModel> {
    return this.http.post('/api/users', {login, password, birthYear});
  }

  authenticate(credentials): Observable<UserModel> {
    return this.http
      .post('/api/users/authentication', credentials)
      .do(user => this.storeLoggedInUser(user));
  }

  storeLoggedInUser(user) {
    window.localStorage.setItem('rememberMe', JSON.stringify(user));
    this.userEvents.next(user);
  }

  retrieveUser() {
    const value = window.localStorage.getItem('rememberMe');
    if (value) {
      const user = JSON.parse(value);
      this.userEvents.next(user);
    }
  }

  logout() {
    this.userEvents.next(null);
    window.localStorage.removeItem('rememberMe');
  }

}
