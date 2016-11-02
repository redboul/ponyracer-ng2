import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { UserModel } from './models/user.model';

@Injectable()
export class UserService {

  static REMEMBER_ME_KEY: string = 'rememberMe';
  userEvents: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(undefined);
  localStorage = window.localStorage;

  constructor(private http: Http) {
    this.retrieveUser();
  }

  register(login: string, password: string, birthYear: number): Observable<any> {
    return this.http
      .post('http://ponyracer.ninja-squad.com/api/users', {login, password, birthYear})
      .map(response => response.json());
  }

  authenticate(credentials: {login: string, password: string}): Observable<UserModel> {
    return this.http
          .post('http://ponyracer.ninja-squad.com/api/users/authentication', credentials)
          .map(response => response.json())
          .do((user: UserModel) => this.storeLoggedInUser(user));
  }

  storeLoggedInUser(user: UserModel): void {
    localStorage.setItem(UserService.REMEMBER_ME_KEY, JSON.stringify(user));
    this.userEvents.next(user);
  }

  retrieveUser(): void {
    let user = this.localStorage.getItem(UserService.REMEMBER_ME_KEY);
    if (user) {
      this.userEvents.next(JSON.parse(user));
    }
  }

}
