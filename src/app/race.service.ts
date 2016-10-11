import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Race } from './models/race.model';
import 'rxjs/add/observable/of';

@Injectable()
export class RaceService {

  constructor() { }

  list(): Observable<Array<Race>> {
    return Observable.of([
      {name: 'Lyon'},
      {name: 'Los Angeles'},
      {name: 'Sydney'},
      {name: 'Tokyo'},
      {name: 'Casablanca'}
    ]);
  }

}
