import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RaceModel } from './models/race.model';
import { Http } from '@angular/http';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map'

@Injectable()
export class RaceService {

  constructor(private http: Http) { }

  list(): Observable<Array<RaceModel>> {

    return this.http.get('http://ponyracer.ninja-squad.com/api/races?status=PENDING').map(response => {
      return <Array<RaceModel>>response.json();
    });
  }

}
