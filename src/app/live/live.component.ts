import { Component, OnInit, Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { RaceModel } from '../models/race.model';
import { PonyWithPositionModel } from '../models/pony.model';
import { RaceService } from '../race.service';

@Component({
  selector: 'pr-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
@Injectable()
export class LiveComponent implements OnInit, OnDestroy {

  raceModel: RaceModel;
  raceSubscription: Subscription;
  positionSubscription: Subscription;
  poniesWithPosition: Array<PonyWithPositionModel>;

  constructor(private route: ActivatedRoute, private raceService: RaceService) { }

  ngOnInit() {
    this.raceSubscription = this.raceService.get(Number(this.route.snapshot.params['raceId']))
      .subscribe(race => {
        this.raceModel = race;
        this.positionSubscription = this.raceService.live(race.id)
          .subscribe(ponies => {
             this.poniesWithPosition = ponies;
          });
      });
  }
  ngOnDestroy() {
    if (this.raceSubscription) {
      this.raceSubscription.unsubscribe();
    }
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
    }
  }
}
