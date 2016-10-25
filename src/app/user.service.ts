import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map'

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  register(login: string, password: string, birthYear: number): Observable<any> {
    return this.http
      .post('http://ponyracer.ninja-squad.com/api/users', {login, password, birthYear}).map(response => {
        return response.json()
      });
  }

}
