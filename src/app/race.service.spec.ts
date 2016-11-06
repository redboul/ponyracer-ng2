import { async, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { RaceService } from './race.service';
import { HttpService } from './http.service';

describe('RaceService Service', () => {

  let raceService: RaceService;
  const httpService = jasmine.createSpyObj('HttpService', ['get', 'post', 'delete']);

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: HttpService, useValue: httpService },
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

});
