import { Client, connect, NatsConnectionOptions, Payload } from 'ts-nats';
import { appLogger } from './logger';
const logger = appLogger.makeLogger('main');

import { AppClient } from './Client';

const opts: NatsConnectionOptions = {
  payload: Payload.BINARY,
  servers: ['localhost']
};

connect(opts)
  .then((natsClient: Client) => {
    natsClient.publish('req1', 'HELLO1');
    natsClient.publish('req1', 'HELLO2');
    natsClient.publish('req1', 'HELLO3');
    natsClient.publish('req1', 'HELLO4');

    const c = new AppClient(natsClient);
    c.register('lllll');
  })
  .catch(error => {
    logger.debug('connect error', error);
  });
