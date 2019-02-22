import { appLogger } from './logger';
const logger = appLogger.makeLogger('client');

import { Client } from 'ts-nats';

import { from, Observable } from 'rxjs';
import { Registration } from './Registration/compiled';

export interface IRegistrationRequest {
  id: string;
}

export interface IRegistrationResponse {
  server_id: string;
}

export class AppClient {
  constructor(public client: Client) {}

  public register(id: string): void {
    const buffer = Registration.Request.encode({ clientId: 'xCCC' }).finish();

    const registrationPromise = this.client.request('registration', 1000, buffer).then<Registration.Response>(msg => {
      return Registration.Response.decode(msg.data);
    });

    const x = from(registrationPromise);
    x.subscribe(obs => {
      logger.debug('Observed: ', obs);
    });
  }
}

export class AppServer {
  constructor(public client: Client) {}

  public registration(): void {
    const x = this.client.subscribe('registration', (err, msg) => {
      if (err) {
        logger.error('registration subscription failed', err);
      }
      if (msg.reply) {
        const data = Registration.Request.decode(msg.data);
        logger.debug('DATA', data);

        const res = Registration.Response.encode({ serverId: 'xxx' }).finish();

        this.client.publish(msg.reply, res);
      }
    });
  }
}
