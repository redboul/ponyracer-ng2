import { RacesComponent } from './races/races.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BetComponent } from './bet/bet.component';

export const ROUTES = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'races', children: [
        { path: '', component: RacesComponent },
        { path: ':raceId', component: BetComponent}
    ] },
    { path: 'register', component: RegisterComponent }
];
