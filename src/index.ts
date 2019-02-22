import { Client, connect, NatsConnectionOptions, Payload } from 'ts-nats';
import { appLogger } from './logger';
const logger = appLogger.makeLogger('main');

import { AppClient, AppServer } from './Client';

const opts: NatsConnectionOptions = {
  payload: Payload.BINARY,
  servers: ['localhost']
};

connect(opts)
  .then((natsClient: Client) => {
    const s = new AppServer(natsClient);
    s.registration();

    const c = new AppClient(natsClient);
    c.register('lllll');

    natsClient.on('subscribe', () => {
      logger.debug('subscribed');
    });

    natsClient
      .subscribe('test', (err, msg) => {
        if (err) {
          logger.debug('subscription error', err);
        }
        logger.debug('subscriber -> ', msg);
      })
      .then(() => {
        natsClient.publish('test', 'hello im ready');
      })
      .catch(error => {
        logger.debug('subscribe error', error);
      });
  })
  .catch(error => {
    logger.debug('connect error', error);
  });
