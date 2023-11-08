import './common/config';
import { buildApp } from './modules/web/app';
import { getLogger } from './common/logging';
import { APP_TYPE } from './common/constants';
import { Server } from 'http';
import { createSimpleHealthCheckApp } from './modules/common/routes/healthcheck.routes';
import { buildWorker } from './modules/worker/urls.worker';
import * as express from 'express';

require('express-async-errors');

const { ENVIRONMENT, NODE_ENV, PORT } = process.env;
let _server: Server = null;

async function init() {
  const log = getLogger();
  log.info(
    {
      environment: ENVIRONMENT,
      nodeEnv: NODE_ENV,
    },
    'app_start'
  );

  let serverApp: express.Application = null;
  log.info({ type: process.env.APP_TYPE }, 'Starting application');

  switch (process.env.APP_TYPE) {
    case APP_TYPE.WORKER:
      await buildWorker();
      serverApp = createSimpleHealthCheckApp();
      break;
    case APP_TYPE.API:
      serverApp = buildApp();
      break;
  }

  if (!serverApp) {
    throw new Error('No server app was defined, terminating');
  }

  let port = parseInt(PORT, 10);

  if (!port) {
    log.warn({}, 'Port is not defined, using default');
    port = 5000;
  }

  _server = serverApp.listen(port, () => {
    log.info(
      {
        port: PORT,
      },
      'listening'
    );
  });
}

init().catch(err => {
  getLogger().error(err, 'Root error');
  process.exit(1);
});
