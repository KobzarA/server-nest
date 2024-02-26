import dotenv from 'dotenv';
import path from 'path';
interface IConfig {
  MONGO_URL: string;
  DB_NAME: string;
  SESSION_SECRET: string;
  PRIVAT_JWT_KEY: string;
}

// Load the appropriate .env file based on the NODE_ENV environment variable
let config: dotenv.DotenvParseOutput | undefined;
switch (process.env.NODE_ENV) {
  case 'production':
    // console.log(path.resolve(process.cwd(), '.env.production'));
    config = dotenv.config({
      path: path.resolve(process.cwd(), 'server', '.env.production'),
    }).parsed;
    break;
  case 'development':
    config = dotenv.config({ path: '.env.development' }).parsed;
    break;
  case 'test':
    config = dotenv.config({ path: '.env.test' }).parsed;
    break;
  case 'stage':
    // for future
    config = dotenv.config({ path: '.env.stage' }).parsed;
    break;
  default:
    // Load the default .env file for development
    config = dotenv.config().parsed;
}

const { MONGO_URL, DB_NAME, SESSION_SECRET, PRIVAT_JWT_KEY } =
  config as unknown as IConfig;

if (!(MONGO_URL && DB_NAME && SESSION_SECRET && PRIVAT_JWT_KEY)) {
  throw new Error('Some of env property doesn`t exists');
}
export { config };
export const privateJWTKey = process.env.PRIVAT_JWT_KEY;
