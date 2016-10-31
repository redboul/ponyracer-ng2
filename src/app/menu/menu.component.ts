import { Component, OnInit, OnDestroy, Injectable } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';

@Component({
  selector: 'pr-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
@Injectable()
export class MenuComponent implements OnInit, OnDestroy {

  navbarCollapsed: boolean = true;
  user: UserModel;
  userEventsSubscription: Subscription;

  constructor(private userService: UserService) { }

  toggleNavbar() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  ngOnInit() {
    this.userEventsSubscription = this.userService.userEvents.subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    if (this.userEventsSubscription) {
      this.userEventsSubscription.unsubscribe();
    }
  }
}
