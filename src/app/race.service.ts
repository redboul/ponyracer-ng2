import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';

import { RaceModel } from './models/race.model';
import { PonyWithPositionModel } from './models/pony.model';
import { HttpService } from './http.service';
import { WsService } from './ws.service';

@Injectable()
export class RaceService {

  constructor(private http: HttpService, private ws: WsService) {}

  list(): Observable<Array<RaceModel>> {
    return this.http.get('/api/races?status=PENDING');
  }

  get(raceId): Observable<RaceModel> {
    return this.http.get(`/api/races/${raceId}`);
  }

  bet(raceId, ponyId): Observable<RaceModel> {
    return this.http.post(`/api/races/${raceId}/bets`, { ponyId });
  }

  cancelBet(raceId): Observable<any> {
    return this.http.delete(`/api/races/${raceId}/bets`);
  }

  live(raceId): Observable<Array<PonyWithPositionModel>> {
    return this.ws.connect(`/race/${raceId}`).map(body => body.ponies);
  }

}
