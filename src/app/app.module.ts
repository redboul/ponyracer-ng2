import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import * as Webstomp from 'webstomp-client';

import { ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { RacesComponent } from './races/races.component';
import { RaceService } from './race.service';
import { WsService } from './ws.service';
import { RaceComponent } from './race/race.component';
import { PonyComponent } from './pony/pony.component';
import { FromNowPipe } from './from-now.pipe';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { UserService } from './user.service';
import { LoginComponent } from './login/login.component';
import { HttpService } from './http.service';
import { BetComponent } from './bet/bet.component';
import { LiveComponent } from './live/live.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    RacesComponent,
    RaceComponent,
    PonyComponent,
    FromNowPipe,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    BetComponent,
    LiveComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    RaceService,
    UserService,
    HttpService,
    WsService,
    { provide: 'WebSocket', useValue: WebSocket },
    { provide: 'Webstomp', useValue: Webstomp }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
