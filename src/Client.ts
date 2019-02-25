import { appLogger } from './logger';
const logger = appLogger.makeLogger('client');

import { Client, Msg, MsgCallback } from 'ts-nats';

import { from, Observable, Subscriber } from 'rxjs';
import { NatsError } from 'ts-nats/lib/error';
import { Registration } from './Registration/compiled';

export class AppClient {
  constructor(public client: Client) {}

  public register(id: string): void {
    const buffer = Registration.Request.encode({ clientId: id }).finish();

    const registrationPromise = this.client.request('registration', 1000, buffer).then<Registration.Response>(msg => {
      const r = Registration.Response.decode(msg.data);
      logger.debug('RESPONSE', r);
      return r;
    });

    const x = from(registrationPromise);
    x.subscribe(obs => {
      logger.debug('Observed: ', obs.clientId, obs.serverId);
    });
  }
}
