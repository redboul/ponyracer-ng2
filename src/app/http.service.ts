import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { UserService } from './user.service';

@Injectable()
export class HttpService {

  baseUrl: string = 'http://ponyracer.ninja-squad.com';
  headers: Headers = new Headers({});
  options: RequestOptions = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  get(path: string): Observable<any> {
    this.addJwtTokenIfExists();
    return this.http.get(`${this.baseUrl}${path}`, this.options).map(response => response.json());
  }

  post(path: string, body: any): Observable<any> {
    this.addJwtTokenIfExists();
    return this.http.post(`${this.baseUrl}${path}`, body, this.options).map(response => response.json());
  }

  addJwtTokenIfExists() {
    const userString = window.localStorage.getItem(UserService.REMEMBER_ME_KEY);
    if (userString) {
      const user = JSON.parse(userString);
      if (user.token) {
        this.headers.set('Authorization', `Bearer ${user.token}`);
      } else {
        this.deleteAuthorization();
      }
    } else {
      this.deleteAuthorization();
    }
  }

  deleteAuthorization() {
    this.headers.delete('Authorization');
  }

}
