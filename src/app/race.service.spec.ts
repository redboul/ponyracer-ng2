import { async, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';

import { RaceService } from './race.service';
import { HttpService } from './http.service';
import { WsService } from './ws.service';
import { PonyWithPositionModel } from './models/pony.model';

describe('RaceService', () => {

  let raceService: RaceService;
  const httpService = jasmine.createSpyObj('HttpService', ['get', 'post', 'delete']);
  const wsService = jasmine.createSpyObj('WsService', ['connect']);

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: HttpService, useValue: httpService },
      { provide: WsService, useValue: wsService },
      RaceService
    ]
  }));

  beforeEach(() => raceService = TestBed.get(RaceService));

  it('should return an Observable of 3 races', async(() => {
    // fake response
    const hardcodedRaces = [{ name: 'Paris' }, { name: 'Tokyo' }, { name: 'Lyon' }];
    httpService.get.and.returnValue(Observable.of(hardcodedRaces));

    raceService.list().subscribe(races => {
      expect(races.length).toBe(3);
      expect(httpService.get).toHaveBeenCalledWith('/api/races?status=PENDING');
    });
  }));

  it('should get a race', async(() => {
    // fake response
    const race = { name: 'Paris' };
    httpService.get.and.returnValue(Observable.of(race));

    const raceId = 1;

    raceService.get(raceId).subscribe(() => {
      expect(httpService.get).toHaveBeenCalledWith('/api/races/1');
    });
  }));

  it('should bet on a race', async(() => {
    // fake response
    httpService.post.and.returnValue(Observable.of({ id: 1 }));

    const raceId = 1;
    const ponyId = 2;

    raceService.bet(raceId, ponyId).subscribe(() => {
      expect(httpService.post).toHaveBeenCalledWith('/api/races/1/bets', { ponyId });
    });
  }));

  it('should cancel a bet on a race', async(() => {
    // fake response
    httpService.delete.and.returnValue(Observable.of(null));

    const raceId = 1;

    raceService.cancelBet(raceId).subscribe(() => {
      expect(httpService.delete).toHaveBeenCalledWith('/api/races/1/bets');
    });
  }));

  it('should return live positions from websockets', async(() => {
    const raceId = 1;
    const messages = new Subject<{status: string; ponies: Array<PonyWithPositionModel>}>();
    let positions: Array<PonyWithPositionModel> = [];

    wsService.connect.and.returnValue(messages);

    raceService.live(raceId).subscribe(pos => {
      positions = pos;
    });

    expect(wsService.connect).toHaveBeenCalledWith(`/race/${raceId}`);

    messages.next({
      status: 'RUNNING',
      ponies: [{
        id: 1,
        name: 'Superb Runner',
        color: 'BLUE',
        position: 1
      }]
    });

    messages.next({
      status: 'RUNNING',
      ponies: [{
        id: 1,
        name: 'Superb Runner',
        color: 'BLUE',
        position: 100
      }]
    });

    expect(positions.length).toBe(1);
    expect(positions[0].position).toBe(100);
  }));

});
