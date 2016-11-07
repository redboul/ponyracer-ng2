import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RaceModel } from './models/race.model';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { HttpService } from './http.service';
import { PonyWithPositionModel } from './models/pony.model';

@Injectable()
export class RaceService {

  constructor(private http: HttpService) { }

  list(): Observable<Array<RaceModel>> {
    return this.http.get('/api/races?status=PENDING');
  }

  bet(raceId: number, ponyId: number): Observable<any> {
    return this.http.post(`/api/races/${raceId}/bets`, { ponyId });
  }

  cancelBet( raceId: number ): Observable<any> {
    return this.http.delete(`/api/races/${raceId}/bets`);
  }

  get( raceId: number ): Observable<any> {
    return this.http.get(`/api/races/${raceId}`);
  }

  live(raceId: number): Observable<Array<PonyWithPositionModel>> {
    return Observable
      .interval(200)
      .take(101)
      .map(position => [{
        id: 1,
        name: 'Superb Runner',
        color: 'BLUE',
        position: position
      }, {
        id: 2,
        name: 'Awesome Fridge',
        color: 'GREEN',
        position: position
      }, {
        id: 3,
        name: 'Great Bottle',
        color: 'ORANGE',
        position: position
      }, {
        id: 4,
        name: 'Little Flower',
        color: 'YELLOW',
        position: position
      }, {
        id: 5,
        name: 'Nice Rock',
        color: 'PURPLE',
        position: position
      }]);
  }
}
