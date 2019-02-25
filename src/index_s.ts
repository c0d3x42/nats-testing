import { Client, connect, NatsConnectionOptions, Payload } from 'ts-nats';
import { appLogger } from './logger';
const logger = appLogger.makeLogger('main');

import { AppServer } from './Server';

import { interval } from 'rxjs';

const opts: NatsConnectionOptions = {
  payload: Payload.BINARY,
  servers: ['localhost']
};

connect(opts)
  .then((natsClient: Client) => {
    const s = new AppServer(natsClient);
    const p = s.registration();
    p.subscribe(req => {
      logger.debug('-> ', req.clientId);
    });
  })
  .catch(error => {
    logger.debug('connect error', error);
  });
