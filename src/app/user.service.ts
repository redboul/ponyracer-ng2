import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { UserModel } from './models/user.model';
import { HttpService } from './http.service';

@Injectable()
export class UserService {

  static REMEMBER_ME_KEY: string = 'rememberMe';
  userEvents: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(undefined);
  localStorage = window.localStorage;

  constructor(private httpService: HttpService) {
    this.retrieveUser();
  }

  register(login: string, password: string, birthYear: number): Observable<any> {
    return this.httpService
      .post('/api/users', {login, password, birthYear});
  }

  authenticate(credentials: {login: string, password: string}): Observable<UserModel> {
    return this.httpService
          .post('/api/users/authentication', credentials)
          .do((user: UserModel) => this.storeLoggedInUser(user));
  }

  logout() {
    this.localStorage.removeItem(UserService.REMEMBER_ME_KEY);
    this.userEvents.next(null);
  }

  storeLoggedInUser(user: UserModel): void {
    this.localStorage.setItem(UserService.REMEMBER_ME_KEY, JSON.stringify(user));
    this.userEvents.next(user);
  }

  retrieveUser(): void {
    let user = this.localStorage.getItem(UserService.REMEMBER_ME_KEY);
    if (user) {
      this.userEvents.next(JSON.parse(user));
    }
  }

}
