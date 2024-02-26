import http from 'http';
import https from 'https';

import fs from 'fs';
import path from 'path';
import app from '../app';
import { config } from '../config';
import { connectMongo } from '../lib/mongo';

const PORT = process.env.PORT || 8000;
const RENDER_COM = process.env.RENDER_COM;

const server = !RENDER_COM
  ? https.createServer(
      {
        key: fs.readFileSync(
          path.join(__dirname, '..', '..', 'server-key.pem')
        ),
        cert: fs.readFileSync(
          path.join(__dirname, '..', '..', 'server-cert.pem')
        ),
      },
      app
    )
  : http.createServer(app);

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  console.info(`listening on ${bind}`);
});

const startServer = async () => {
  await connectMongo();
  server.listen(PORT);
};

startServer();
