import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RaceModel } from './models/race.model';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { HttpService } from './http.service';

@Injectable()
export class RaceService {

  constructor(private http: HttpService) { }

  list(): Observable<any> {
    return this.http.get('/api/races?status=PENDING');
  }

}
