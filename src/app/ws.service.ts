import { Injectable, Inject } from '@angular/core';
import * as Webstomp from 'webstomp-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WsService {

  constructor(@Inject('Webstomp') private Webstomp, @Inject('WebSocket') private WebSocket) { }

  connect(channel): Observable<any> {
    return Observable.create(observer => {
      const connection = new this.WebSocket('ws://ponyracer.ninja-squad.com/ws');
      const stompClient = this.Webstomp.over(connection);
      let subscription;
      stompClient.connect({login: null, passcode: null},
        () => subscription = stompClient.subscribe(channel, message => observer.next(JSON.parse(message.body))),
        error => observer.error(error));
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
        connection.close();
      };
    });
}

}
