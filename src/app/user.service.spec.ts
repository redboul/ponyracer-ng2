import { async, TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { UserService } from './user.service';

describe('User Service', () => {

  let userService: UserService;
  let mockBackend: MockBackend;

  const user = {
    id: 1,
    login: 'cedric',
    money: 1000,
    registrationInstant: '2015-12-01T11:00:00Z',
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo'
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MockBackend,
      BaseRequestOptions,
      {
        provide: Http,
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      },
      UserService
    ]
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    mockBackend = TestBed.get(MockBackend);
  });

  it('should register a user', async(() => {
    // fake response
    const response = new Response(new ResponseOptions({ body: user }));
    // return the response if we have a connection to the MockBackend
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toBe('http://ponyracer.ninja-squad.com/api/users');
      expect(connection.request.method).toBe(RequestMethod.Post);
      connection.mockRespond(response);
    });

    userService.register(user.login, 'password', 1986).subscribe(res => {
      expect(res.id).toBe(1, 'You should transform the Response into a user using the `json()` method.');
    });
  }));

  it('should authenticate a user', async(() => {
    // fake response
    const response = new Response(new ResponseOptions({ body: user }));
    // return the response if we have a connection to the MockBackend
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url)
        .toBe('http://ponyracer.ninja-squad.com/api/users/authentication');
      expect(connection.request.method).toBe(RequestMethod.Post);
      connection.mockRespond(response);
    });

    // spy on userEvents
    spyOn(userService.userEvents, 'next');

    const credentials = {login: 'cedric', password: 'hello'};
    userService.authenticate(credentials).subscribe(res => {
      expect(res.id).toBe(1, 'You should transform the Response into a user using the `json()` method.');
      expect(userService.userEvents.next).toHaveBeenCalledWith(res);
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

  it('should logout the user', () => {
    spyOn(userService.userEvents, 'next');
    spyOn(window.localStorage, 'removeItem');

    userService.logout();

    expect(userService.userEvents.next).toHaveBeenCalledWith(null);
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('rememberMe');
  });
});
