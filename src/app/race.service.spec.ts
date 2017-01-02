import { async, fakeAsync, tick, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { RaceService } from './race.service';
import { HttpService } from './http.service';
import { PonyWithPositionModel } from './models/pony.model';

describe('RaceService', () => {

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

  it('should return live positions every seconds', fakeAsync(() => {
    const raceId = 1;
    let positions: Array<PonyWithPositionModel> = [];
    let counter = 0;

    raceService.live(raceId).subscribe(pos => {
      positions = pos;
      counter++;
    });

    expect(positions.length).toBe(0, 'The observable should only emit after 1 second');

    // emulates the 1 second delay
    tick(1000);
    expect(positions.length).toBe(5, 'The observable should have emitted after a 1 second inteval');
    let position = positions[0];
    expect(position.name).toBe('Superb Runner');
    expect(position.color).toBe('BLUE');
    expect(position.position).toBe(0);
    tick(1000);

    expect(positions.length).toBe(5);
    position = positions[1];
    expect(position.name).toBe('Awesome Fridge');
    expect(position.color).toBe('GREEN');
    expect(position.position).toBe(1);

    // emulates the 100 seconds of the race
    while (counter < 100) {
      tick(1000);
    }

    expect(positions.length).toBe(5);
    position = positions[2];
    expect(position.name).toBe('Great Bottle');
    expect(position.color).toBe('ORANGE');
    expect(position.position).toBe(99);

    tick(1000);
    expect(positions.length).toBe(5);
    position = positions[3];
    expect(position.name).toBe('Little Flower');
    expect(position.color).toBe('YELLOW');
    expect(position.position).toBe(100);

    tick(1000);
    expect(positions.length).toBe(5);
    position = positions[4];
    expect(position.name).toBe('Nice Rock');
    expect(position.color).toBe('PURPLE');
    expect(position.position).toBe(100);
  }));

});
