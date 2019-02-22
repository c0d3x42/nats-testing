import * as Pino from 'pino';

class BaseLogger {
  private baseLogger: Pino.Logger;
  constructor() {
    this.baseLogger = Pino({ name: 'app', level: 'debug' });
  }

  public makeLogger(module: string): Pino.Logger {
    return this.baseLogger.child({ module });
  }
}

export const appLogger = new BaseLogger();
