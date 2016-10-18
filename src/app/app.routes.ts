import { Routes } from '@angular/router'; 
import { RacesComponent } from './races/races.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';

export const ROUTES = [
    { path: '', component: HomeComponent },
    { path: 'races', component: RacesComponent },
    { path: 'register', component: RegisterComponent }
];