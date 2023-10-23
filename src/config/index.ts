import dotenv from 'dotenv';

// Load the appropriate .env file based on the NODE_ENV environment variable
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config(); // Load the default .env file for development
}

export const privateJWTKey = process.env.PRIVAT_JWT_KEY;
