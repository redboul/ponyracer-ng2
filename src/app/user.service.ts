import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { UserModel } from './models/user.model';

@Injectable()
export class UserService {

  userEvents: Subject<UserModel> = new Subject<UserModel>();

  constructor(private http: Http) { }

  register(login: string, password: string, birthYear: number): Observable<any> {
    return this.http
      .post('http://ponyracer.ninja-squad.com/api/users', {login, password, birthYear})
      .map(response => response.json());
  }

  authenticate(credentials: {login: string, password: string}): Observable<UserModel> {
    return this.http
          .post('http://ponyracer.ninja-squad.com/api/users/authentication', credentials)
          .map(response => response.json()).do(this.userEvents);
  }

}
