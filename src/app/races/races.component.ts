import { Component, OnInit, Injectable } from '@angular/core';
import { Race } from '../models/race.model';
import {RaceService } from '../race.service';

@Component({
  selector: 'pr-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css']
})
@Injectable()
export class RacesComponent implements OnInit {

  races: Array<Race>;
  
  constructor( private raceService: RaceService) { }

  ngOnInit() {
    this.raceService.list().subscribe(races => this.races = races);
  }

}
