import { Component, OnInit, OnDestroy, Injectable } from '@angular/core';

import { Router } from '@angular/router';

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

  constructor(private userService: UserService, private router: Router) { }

  toggleNavbar() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  logout(event) {
    this.userService.logout();
    event.preventDefault();
    this.router.navigate(['/']);
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
