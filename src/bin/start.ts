import http from 'http';
import app from '../app';

import 'dotenv/config';
import { connectMongo } from '../lib/mongo';

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

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
