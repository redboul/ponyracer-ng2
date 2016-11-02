import { async, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { UserService } from './user.service';
import { HttpService } from './http.service';

describe('User Service', () => {

  let userService: UserService;
  const httpService = jasmine.createSpyObj('HttpService', ['post']);

  const user = {
    id: 1,
    login: 'cedric',
    money: 1000,
    registrationInstant: '2015-12-01T11:00:00Z',
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo'
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: HttpService, useValue: httpService },
      UserService
    ]
  }));

  beforeEach(() => userService = TestBed.get(UserService));

  it('should register a user', async(() => {
    // fake response
    httpService.post.and.returnValue(Observable.of(user));

    userService.register(user.login, 'password', 1986).subscribe(res => {
      expect(res.id).toBe(1, 'You should transform the Response into a user using the `json()` method.');
      expect(httpService.post).toHaveBeenCalledWith('/api/users', {
        login: user.login,
        password: 'password',
        birthYear: 1986
      });
    });
  }));

  it('should authenticate a user', async(() => {
    // fake response
    httpService.post.and.returnValue(Observable.of(user));
    // spy on the store method
    spyOn(userService, 'storeLoggedInUser');

    const credentials = { login: 'cedric', password: 'hello' };
    userService.authenticate(credentials)
      .subscribe(() => {
        expect(userService.storeLoggedInUser).toHaveBeenCalledWith(user);
        expect(httpService.post).toHaveBeenCalledWith('/api/users/authentication', credentials);
      });
  }));

  it('should store the logged in user', () => {
    spyOn(userService.userEvents, 'next');
    spyOn(window.localStorage, 'setItem');

    userService.storeLoggedInUser(user);

    expect(userService.userEvents.next).toHaveBeenCalledWith(user);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('rememberMe', JSON.stringify(user));
  });

  it('should retrieve no user if none stored', () => {
    spyOn(userService.userEvents, 'next');
    spyOn(window.localStorage, 'getItem').and.returnValue(JSON.stringify(user));

    userService.retrieveUser();

    expect(userService.userEvents.next).toHaveBeenCalledWith(user);
  });

  it('should retrieve no user if none stored', () => {
    spyOn(userService.userEvents, 'next');
    spyOn(window.localStorage, 'getItem');

    userService.retrieveUser();

    expect(userService.userEvents.next).not.toHaveBeenCalled();
  });

  it('should logout the user', () => {
    spyOn(userService.userEvents, 'next');
    spyOn(window.localStorage, 'removeItem');

    userService.logout();

    expect(userService.userEvents.next).toHaveBeenCalledWith(null);
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('rememberMe');
  });
});
