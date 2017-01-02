import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RaceService } from '../race.service';
import { RaceModel } from '../models/race.model';
import { PonyWithPositionModel } from '../models/pony.model';

@Component({
  selector: 'pr-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit, OnDestroy {

  raceModel: RaceModel;
  poniesWithPosition: Array<PonyWithPositionModel>;
  positionSubscription: Subscription;

  constructor(private raceService: RaceService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    const id = this.route.snapshot.params['raceId'];
    this.raceService.get(id).subscribe(race => this.raceModel = race);
    this.positionSubscription = this.raceService.live(id).subscribe(positions => this.poniesWithPosition = positions);
  }

  ngOnDestroy() {
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
    }
  }

}
