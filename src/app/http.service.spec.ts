import { async, TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { HttpService } from './http.service';

describe('Http Service', () => {

  let httpService: HttpService;
  let mockBackend: MockBackend;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MockBackend,
      BaseRequestOptions,
      {
        provide: Http,
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      },
      HttpService
    ]
  }));

  beforeEach(() => {
    httpService = TestBed.get(HttpService);
    mockBackend = TestBed.get(MockBackend);
  });

  it('should init the service', () => {
    expect(httpService.baseUrl)
      .toBe('http://ponyracer.ninja-squad.com', 'Your service should have a field `baseUrl` correctly initialized');
    expect(httpService.options.headers)
      .toBe(httpService.headers, 'Your service should have a field `options` correctly initialized with the headers');
  });

  it('should do a GET request', async(() => {
    const hardcodedRaces = [{ name: 'Paris' }, { name: 'Tokyo' }, { name: 'Lyon' }];
    const response = new Response(new ResponseOptions({ body: hardcodedRaces }));
    // return the response if we have a connection to the MockBackend
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url)
        .toBe('http://ponyracer.ninja-squad.com/api/races?status=PENDING', 'The service should build the correct URL for a GET');
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.headers.get('Authorization')).toBeNull();
      connection.mockRespond(response);
    });

    httpService.get('/api/races?status=PENDING').subscribe((res) => {
      expect(res).toBe(hardcodedRaces);
    });

  }));

  it('should do a POST request', async(() => {
    const user = { login: 'cedric' };
    const response = new Response(new ResponseOptions({ body: user }));
    // return the response if we have a connection to the MockBackend
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url)
        .toBe('http://ponyracer.ninja-squad.com/api/users', 'The service should build the correct URL for a POST');
      expect(connection.request.method).toBe(RequestMethod.Post);
      expect(connection.request.headers.get('Authorization')).toBeNull();
      connection.mockRespond(response);
    });

    httpService.post('/api/users', user).subscribe((res) => {
      expect(res).toBe(user);
    });

  }));

  it('should add/remove the JWT token to the headers', () => {
    // will first return a 'secret' token, then nothing on second call
    let firstCall = true;
    spyOn(window.localStorage, 'getItem').and.callFake(() => {
      if (firstCall) {
        firstCall = false;
        return JSON.stringify({ token: 'secret' });
      }
      return null;
    });

    httpService.addJwtTokenIfExists();

    // so we should have a header the first time
    expect(httpService.headers.get('Authorization'))
      .toBe('Bearer secret', 'The `Authorization` header is not correct after adding the JWT token');

    httpService.addJwtTokenIfExists();

    // and no header the second time
    expect(httpService.headers.get('Authorization')).toBeNull('The `Authorization` header should be null after removing the JWT token');
  });

  it('should do an authenticated GET request', async(() => {
    spyOn(window.localStorage, 'getItem')
      .and.returnValue(JSON.stringify({ token: 'secret' }));

    const hardcodedRaces = [{ name: 'Paris' }, { name: 'Tokyo' }, { name: 'Lyon' }];
    const response = new Response(new ResponseOptions({ body: hardcodedRaces }));
    // return the response if we have a connection to the MockBackend
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url)
        .toBe('http://ponyracer.ninja-squad.com/api/races?status=PENDING');
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.headers.get('Authorization')).toBe('Bearer secret');
      connection.mockRespond(response);
    });

    httpService.get('/api/races?status=PENDING').subscribe((res) => {
      expect(res).toBe(hardcodedRaces);
    });

  }));
});
