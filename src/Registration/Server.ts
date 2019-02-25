import { Observable, Subject, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client, Msg, MsgCallback } from 'ts-nats';
import { NatsError } from 'ts-nats/lib/error';
import { Registration } from './compiled';

export class BaseRegistrationServer {
  constructor(public client: Client) {}

  private listen_cb(observer: Subscriber<Msg>): MsgCallback {
    return (err: NatsError | null, msg: Msg) => {
      if (err) {
        return observer.error(err);
      }
      observer.next(msg);
    };
  }

  public listen(path: string): Observable<Msg> {
    return new Observable<Msg>(observer => {
      const clientPromise = this.client.subscribe(path, this.listen_cb(observer));

      return () => {
        clientPromise.then(service => service.unsubscribe()).catch(err => observer.error(err));
      };
    });
  }
}

export class RegistrationServer extends BaseRegistrationServer {
  public start() {
    const sub = new Subject();

    const e$ = this.listen('reg');
    const t = e$.subscribe();
    e$.pipe(
      map(m => {
        return Registration.Request.decode(m.data);
      })
    );
  }
}
