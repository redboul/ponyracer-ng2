import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

@Injectable()
@Component({
  selector: 'pr-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  credentials = {login: '', password: ''};
  authenticationFailed: boolean = false;

  constructor(private userService: UserService, private router: Router) { }

  authenticate() {
    this.authenticationFailed = false;
    this.userService.authenticate(this.credentials)
      .subscribe(() => this.router.navigate(['/']), () => this.authenticationFailed = true);
  }

  ngOnInit() {
  }

}
