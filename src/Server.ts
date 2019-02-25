import { appLogger } from './logger';
const logger = appLogger.makeLogger('client');

import { Client, Msg, MsgCallback } from 'ts-nats';

import { Observable, pipe, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import { NatsError } from 'ts-nats/lib/error';
import { Registration } from './Registration/compiled';

import { v4 } from 'uuid';
import { Instance } from './models';

export class AppServer {
  public c: number;
  constructor(public client: Client) {
    this.c = 0;
  }

  public listen_cb(observer: Subscriber<Msg>): MsgCallback {
    const r = (err: NatsError | null, msg: Msg) => {
      if (err) {
        return observer.error(err);
      }
      if (msg.reply) {
        const request = Registration.Request.decode(msg.data);
        logger.debug('Registration Request from clientId', request.clientId);

        // construct a response
        const response = Registration.Response.encode({ serverId: 'xxxx', clientId: request.clientId }).finish();
        this.client.publish(msg.reply, response);

        Instance.query()
          .insert({ uuid: v4() })
          .then(saved => {
            logger.debug('saved', saved);
          });
      }
      observer.next(msg);
    };
    return r;
  }

  public listen(path: string): Observable<Msg> {
    const o$ = new Observable<Msg>(observer => {
      const clientPromise = this.client.subscribe(path, this.listen_cb(observer));

      return () => {
        clientPromise.then(service => service.unsubscribe()).catch(err => observer.error(err));
      };
    });

    return o$;
  }

  public registration(): Observable<Registration.Request> {
    const p = this.listen('registration').pipe(
      map(m => {
        return Registration.Request.decode(m.data);
      })
    );

    return p;
  }
}
