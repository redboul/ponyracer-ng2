import { Component, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RaceModel } from '../models/race.model';

import { RaceService } from '../race.service';

@Component({
  selector: 'pr-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css']
})
@Injectable()
export class BetComponent implements OnInit {

  raceModel: RaceModel;
  betFailed: boolean = false;

  constructor( private route: ActivatedRoute, private raceService: RaceService) { }

  betOnPony( pony: { id: number } ) {
    this.raceService.bet(this.raceModel.id, pony.id)
      .subscribe(race => this.raceModel = race, () => this.betFailed = true);
  }

  isPonySelected(pony: { id: number }): boolean {
    return this.raceModel.betPonyId === pony.id;
  }

  ngOnInit() {
    this.raceService.get(Number(this.route.snapshot.params['raceId'])).subscribe(race => this.raceModel = race);
  }

}
