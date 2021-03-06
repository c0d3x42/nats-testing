import { Client, connect, NatsConnectionOptions, Payload } from 'ts-nats';
import { appLogger } from './logger';
const logger = appLogger.makeLogger('main');

import { AppClient } from './Client';
import { AppServer } from './Server';

import { interval } from 'rxjs';

const opts: NatsConnectionOptions = {
  payload: Payload.BINARY,
  servers: ['localhost']
};

connect(opts)
  .then((natsClient: Client) => {
    const s = new AppServer(natsClient);
    s.registration();

    const i$ = interval(2000);
    i$.subscribe(counter => {
      logger.debug('Counter = ', counter);
    });

    const c = new AppClient(natsClient);
    c.register('lllll');
  })
  .catch(error => {
    logger.debug('connect error', error);
  });
