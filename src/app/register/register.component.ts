import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

@Injectable()
@Component({
  selector: 'pr-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  static passwordMatch(group: FormGroup) {
    return (group.get('password').value !== group.get('confirmPassword').value) ? { matchingError: true }: null;
  }

  static validYear(control: FormControl) {
    return (control.value < 1900 || control.value >= new Date().getFullYear() + 1) ? { invalidYear: true } : null;
  }

  loginCtrl: FormControl;
  passwordCtrl: FormControl;
  confirmPasswordCtrl: FormControl;
  birthYearCtrl: FormControl;
  userForm: FormGroup;
  passwordForm: FormGroup;
  registrationFailed: boolean = false;

  constructor(fb: FormBuilder, private userService: UserService, private router: Router) { 
    this.loginCtrl = fb.control('', Validators.compose([Validators.required, Validators.minLength(3)]));
    this.passwordCtrl = fb.control('', Validators.required);
    this.confirmPasswordCtrl = fb.control('', Validators.required);
    this.birthYearCtrl = fb.control('', Validators.compose([Validators.required, RegisterComponent.validYear]));
    this.passwordForm = fb.group({
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    }, { validator: RegisterComponent.passwordMatch });
    this.userForm = fb.group({
      login: this.loginCtrl,
      passwordForm: this.passwordForm,
      birthYear: this.birthYearCtrl
    });
  }

  register() {
    this.registrationFailed = false;
    this.userService.register(this.loginCtrl.value, this.passwordCtrl.value, this.birthYearCtrl.value)
      .subscribe(() => this.router.navigate(['/']), error => {
        this.registrationFailed = true;
      });
  }

  ngOnInit() {
  }

}
