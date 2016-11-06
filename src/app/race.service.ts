import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RaceModel } from './models/race.model';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { HttpService } from './http.service';

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

}
